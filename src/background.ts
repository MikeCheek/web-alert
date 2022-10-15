import { sendMessage } from './sendMessage';
function polling() {
  // console.log("polling");
  setTimeout(polling, 1000 * 30);
}

polling();

chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status === 'complete') {
    sendMessage({ get: 'body' });
  }
});
