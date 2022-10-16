export const sendMessage = (message: any) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, message, (msg) => {
        console.log('result message: ', msg);
      });
    }
  });
};
