import React from 'react';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { Verihub } from './components/verihub';


function App() {
  return (
    <div className="App" style={{margin: '1rem'}}>
      <Verihub />
      <div>
        You can use <code><a href="http://ngrok.io/">ngrok</a></code> to host files on your computer:
        <p>To serve a directory, use the terminal:</p>
        <div>
          <code>bash</code>/<code>zsh</code>:
          <pre>./ngrok file file://`pwd`</pre>
          <code>fish</code>:
          <pre>./ngrok file file://(pwd)</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
