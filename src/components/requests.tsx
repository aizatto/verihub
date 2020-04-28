export async function performOCR(
  verihubURL: string,
  idURL: string,
): Promise<object> {
  let raw = JSON.stringify({
    "id_path": idURL,
  });

  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  // @ts-ignore
  const response = await fetch(`${verihubURL}/performOCRurl`, requestOptions)
  return await response.json();
}

export async function verifyFace(
  verihubURL: string,
  idURL: string,
  selfieURL: string,
): Promise<object> {
  let raw = JSON.stringify({
    "id_path": idURL,
      "selfie_path": selfieURL,
  });

  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  // @ts-ignore
  const response = await fetch(`${verihubURL}/verifyFaceurl`, requestOptions)
  return await response.json();
}