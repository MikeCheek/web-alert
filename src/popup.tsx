import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import sendMessage from './utils/sendMessage';

const Popup = () => {
  const [reload, setReload] = useState<boolean>(false);

  let interval: NodeJS.Timer;

  useEffect(() => {
    return () => {
      setReload(false);
      clearInterval(interval);
    };
  }, []);

  const toggleReload = () => {
    if (reload) {
      clearInterval(interval);
      setReload(false);
    } else {
      setReload(true);
      interval = setInterval(() => {
        sendMessage({ reload: true });
        console.log('runned');
      }, 60000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {reload ? (
        <p>Reloading</p>
      ) : (
        <button onClick={toggleReload} style={{ marginRight: '5px' }}>
          Start reload
        </button>
      )}
      <button onClick={() => sendMessage({ restart: true })}>Send restart</button>

      <button onClick={() => sendMessage({ notification: true })}>Grant notification permission</button>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root')
);
