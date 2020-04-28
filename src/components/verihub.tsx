import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { performOCR, verifyFace } from './requests';
import { LoadingOutlined } from '@ant-design/icons';

export const Verihub: React.FC = () => {
  const [verihubURL, setVerihubURL] = useState<string | null>(localStorage.getItem('verihubURL'));
  const [idURL, setIDURL] = useState<string | null>(localStorage.getItem('idURL'));
  const [selfieURL, setSelfieURL] = useState<string | null>(localStorage.getItem('selfieURL'));

  const [idResponse, setIDResponse] = useState<object>();
  const [selfieResponse, setSelfieResponse] = useState<object>();
  const [error, setError] = useState();
  const [submitting, setSubmitting] = useState<Date>();
  const [now, setNow] = useState(new Date());

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const onFinish = async () => {
    setSubmitting(new Date());
    setNow(new Date());
    if (!verihubURL) {
      return;
    }

    if (!idURL) {
      return;
    }

    try {
      await Promise.all([
        (async () => {
          try {
            const json = await performOCR(verihubURL, idURL);
            setIDResponse(json);
            message.success('ID Response Success');
          } catch (error) {
            console.error(error);
            message.error('ID fail');
          }
        })(),
        (async () => {
          if (!selfieURL) {
            return;
          }
          try {
            const json = await verifyFace(verihubURL, idURL, selfieURL);
            setSelfieResponse(json);
            message.success('Selfie Success');
          } catch (error) {
            console.error(error);
            message.error('Selfie fail');
          }
        })(),
      ])
    } catch (error) {
      setError(error);
      console.error(error);
      message.error(error.message);
    }
    setSubmitting(undefined);
  }

  useEffect(() => {
    if (!submitting) {
      return;
    }
    const interval = setInterval(
      () => {
        setNow(new Date());
      },
      250
    )
    return () => clearInterval(interval);
  }, [submitting]);

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <h1>Verihub</h1>
      <Form
          {...layout}
          name="basic"
          initialValues={{ 
            url: verihubURL,
            id_url: idURL,
            selfie_url: selfieURL,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        > 
        <Form.Item
          label="URL"
          name="url"
          rules={[{ required: true, message: 'Input Verihub URL' }]}
        >
          <Input
            onChange={(e) => {
              setVerihubURL(e.target.value);
              localStorage.setItem('verihubURL', e.target.value);
            }}
          />
        </Form.Item>

        <Form.Item
          label="ID URL"
          name="id_url"
          rules={[{ required: true, message: 'Input ID URL' }]}
        >
          <Input
            onChange={(e) => {
              setIDURL(e.target.value);
              localStorage.setItem('idURL', e.target.value);
            }}
          />
        </Form.Item>

        <Form.Item
          label="Selfie URL"
          name="selfie_url"
        >
          <Input
            onChange={(e) => {
              setSelfieURL(e.target.value);
              localStorage.setItem('selfieURL', e.target.value);
            }}
          />
        </Form.Item>

        <Form.Item {...tailLayout}>
          {submitting
            ? <Button
                type="primary"
                htmlType="submit"
                disabled={true}
                icon={<LoadingOutlined />}>
                Loading: {(now.getTime() - submitting.getTime()) / 1000}s
              </Button>
            : <Button
                type="primary"
                htmlType="submit">
                Submit
              </Button>
          }
        </Form.Item>
      </Form>
      <div>
        ID Response:
        <JSONComponent json={idResponse} />
      </div>
      <div>
        Selfie Response:
        <JSONComponent json={selfieResponse} />
      </div>
      <div>
        Error
        <JSONComponent json={error} />
      </div>
    </>
  );
}

const JSONComponent: React.FC<{json: object | undefined}> = (props) => {
  const { json } = props;
  if (!json) {
    return <></>;
  }
 
  return (
    <pre>{JSON.stringify(props.json, null, 2)}</pre>
  )
}