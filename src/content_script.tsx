let stopped = false;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.reload && !stopped) {
    sendResponse('Ok, I reload');
    reloadAndCheck();
  }
  if (msg.restart) {
    stopped = false;
    sendResponse('Ok, I restart');
  }
});

// chrome.tabs.onUpdated.addListener((_tabId, info) => {
//   setInterval(() => {
//     console.log('2s Interval');
//     if (info.status === 'complete') {
//       if (document) {
//         const bodyHtml = document.body.innerHTML;
//         console.log(bodyHtml);
//         const pattern = /.*Michele.*/gi;
//         if (bodyHtml.match(new RegExp(pattern))) {
//           stopped = true;
//           console.log('MATCH');
//         }
//       }
//     }
//   }, 2000);
// });

const reloadAndCheck = () => {
  window.location.reload();
};

// chrome.runtime.onConnect.addListener((port) => {
//   if (port.name == 'channelName') {
//     port.onMessage.addListener((response) => {
//       if (response.reload) {
//         window.location.reload();
//       }
//     });
//   }
// });
