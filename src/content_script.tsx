let stopped = false;

const words = ["libera, singola"];
const tabooWords = ["cerco", "coinquilina"];

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.reload && !stopped) {
    sendResponse("Ok, I reload");
    reloadAndCheck();
  }
  if (msg.restart) {
    stopped = false;
    sendResponse("Ok, I restart");
  }
  if ((msg.get = "body")) {
    if (document) {
      window.scrollTo(0, 5000);
      const html = document.body.innerHTML.toLowerCase();
      console.log(html);
      // tabooWords.forEach((word) => {
      //   if (html.includes(word)) {
      //     console.log("found " + word);
      //   }
      // });
      words.forEach((word) => {
        if (html.includes(word)) {
          stopped = true;
          console.log(
            "found " +
              word +
              ", I stopped reloading\n Click restart to continue searching"
          );
          if ("Notification" in window) {
            if (window.Notification.permission != "granted")
              window.Notification.requestPermission().then((permission) => {
                if (permission === "granted")
                  new window.Notification("Found " + word);
              });
            else if (window.Notification.permission === "granted")
              new window.Notification("Found " + word);
          }
        }
      });
      if (!stopped) console.log("I'll continue reloading");
    }
  }
});

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
