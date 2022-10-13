import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Popup = () => {
  const [count, setCount] = useState(0);
  const [currentURL, setCurrentURL] = useState<string>();
  const [reload, setReload] = useState<boolean>(false);

  let interval: NodeJS.Timer;

  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setCurrentURL(tabs[0].url);
    });
  }, []);

  const toggleReload = () => {
    if (reload) {
      clearInterval(interval);
      setReload(false);
    } else {
      setReload(true);
      interval = setInterval(() => {
        sendReload();
        console.log('runned');
      }, 10000);
    }
  };

  const sendReload = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            reload: true,
          },
          (msg) => {
            console.log('result message:', msg);
          }
        );
      }
    });
  };

  const sendRestart = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab.id && reload) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            restart: true,
          },
          (msg) => {
            console.log('result message:', msg);
          }
        );
      }
    });
  };

  return (
    <>
      <ul style={{ minWidth: '700px' }}>
        <li>Current URL: {currentURL}</li>
        <li>Current Time: {new Date().toLocaleTimeString()}</li>
      </ul>
      <button onClick={() => setCount(count + 1)} style={{ marginRight: '5px' }}>
        count up
      </button>
      {reload ? (
        <p>Reloading</p>
      ) : (
        <button onClick={toggleReload} style={{ marginRight: '5px' }}>
          Start reload
        </button>
      )}
      <button onClick={sendRestart}>Send restart</button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root')
);
