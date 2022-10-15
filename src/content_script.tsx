let stopped = false;
let found = false;

const words = ['liber', 'singol', 'camer'];
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
      // window.scrollTo(0, 5000);
      checkInNodes(document.body.getElementsByTagName('*'));
      if (!stopped) console.log("I'll continue reloading");
    }
  }

  if (msg.notification) window.Notification.requestPermission();
});

const reload = () => {
  window.location.reload();
};

const itemsToRemove = [
  'xzkaem6 x13vifvy xixxii4 x1e558r4 x1pi30zi xds687c',
  'x78zum5 x1q0g3np xl56j7k x1yztbdb x1y1aw1k',
  'x78zum5 x1q0g3np xl56j7k x1yztbdb x1y1aw1k',
  'x1yztbdb',
  'x9f619 x1ja2u2z xnp8db0 x112wk31 xnjgh8c xxc7z9f x1t2pt76 x1u2d2a2 x6ikm8r x10wlt62 x1xzczws x7wzq59 xxzkxad x9e5oc1',
  'x9f619 x1ja2u2z xnp8db0 x112wk31 xnjgh8c xxc7z9f x1t2pt76 x1u2d2a2 x6ikm8r x10wlt62 x7wzq59 xxzkxad x1daaz14',
  'xixxii4 x1ey2m1c xds687c',
];

const removeElementByClassName = (className: string) => {
  const toRemove = document.getElementsByClassName(className)[0];
  if (toRemove) toRemove.remove();
};

const checkInNodes = (collection: HTMLCollectionOf<Element>) => {
  found = false;
  itemsToRemove.forEach((item) => removeElementByClassName(item));
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
              console.log('found ' + word + ', I stopped reloading\n Click restart to continue searching');
              console.log(element);
              focusElement(element as HTMLElement);
              sendNotification(element.textContent ?? word, () => focusElement(element as HTMLElement));
            }
          }
        });
    });
};

const focusElement = (element: HTMLElement) => {
  element.style.backgroundColor = 'yellow';
  element.style.border = 'solid red 5px';
  element.style.borderRadius = '10px';
  window.focus();
  window.scrollTo(0, element.getBoundingClientRect().top - 150);
};

const sendNotification = (word: string, action: () => void) => {
  const notification = 'Found word "' + word + '"';
  if ('Notification' in window) {
    if (window.Notification.permission != 'granted')
      window.Notification.requestPermission().then((permission) => {
        if (permission === 'granted') new window.Notification(notification).addEventListener('click', () => action());
      });
    else if (window.Notification.permission === 'granted')
      new window.Notification(notification).addEventListener('click', () => action());
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
