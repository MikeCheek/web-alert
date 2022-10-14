let stopped = false;
let found = false;

const words = ['libera', 'singola', 'camera', 'disponibile', 'affittasi'];
const tabooWords = ['coinquilina', 'studentessa'];

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.reload && !stopped) {
    sendResponse('Ok, I reload');
    reload();
  }
  if (msg.restart) {
    stopped = false;
    reload();
    sendResponse('Ok, I restart');
  }
  if (msg.get === 'body') {
    if (document) {
      window.scrollTo(0, 5000);
      checkInNodes(document.body.getElementsByTagName('*'));
      if (!stopped) console.log("I'll continue reloading");
    }
  }

  if (msg.notification) window.Notification.requestPermission();
});

const reload = () => {
  window.location.reload();
};

const checkInNodes = (collection: HTMLCollectionOf<Element>) => {
  found = false;
  Array.from(collection)
    .filter(
      (element) =>
        !(element instanceof HTMLStyleElement) &&
        !(element instanceof HTMLScriptElement) &&
        !(element instanceof HTMLButtonElement) &&
        !(element instanceof HTMLImageElement) &&
        !(element instanceof HTMLVideoElement) &&
        !(element instanceof HTMLCanvasElement) &&
        element.getElementsByTagName('*').length == 0 &&
        element.textContent
    )
    .forEach((element) => {
      if (!found)
        words.forEach((word) => {
          if (!found) {
            if (element.textContent && new RegExp(`.*${word}.*`, 'gi').test(element.textContent)) found = true;

            tabooWords.forEach((tabooWord) => {
              console.log('runned');
              if (element.textContent && new RegExp(`.*${tabooWord}.*`, 'gi').test(element.textContent)) found = false;
            });

            if (found) {
              stopped = true;
              (element as HTMLElement).style.backgroundColor = 'yellow';
              (element as HTMLElement).style.border = 'solid red 5px';
              (element as HTMLElement).style.borderRadius = '10px';
              window.scrollTo(0, element.getBoundingClientRect().top);
              console.log('found ' + word + ', I stopped reloading\n Click restart to continue searching');
              sendNotification(word);
            }
          }
        });
    });
};

const sendNotification = (word: string) => {
  const notification = 'Found word "' + word + '"';
  if ('Notification' in window) {
    if (window.Notification.permission != 'granted')
      window.Notification.requestPermission().then((permission) => {
        if (permission === 'granted') new window.Notification(notification);
      });
    else if (window.Notification.permission === 'granted') new window.Notification(notification);
  }
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

const sanitize = (html: HTMLElement) => {
  let scripts = html.querySelectorAll('script');
  for (let script of scripts) {
    script.remove();
  }
  let styles = html.querySelectorAll('style');
  for (let style of styles) {
    style.remove();
  }
  return html;
};
