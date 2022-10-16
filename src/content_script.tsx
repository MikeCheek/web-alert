import { Msg } from './types';

const stats = {
  elements: 0,
  filteredElements: 0,
  wordsLoop: 0,
  tabooWordsLoop: 0,
  filteringEfficency: '0%',
  algorithmEfficency: '0%',
};

let stopped = false;
let found = false;

const words = ['liber', 'singol', 'camer'];
const tabooWords = ['coinquilina', 'studentessa', 'disperat'];
const itemsToRemoveByClassName = [
  'xzkaem6 x13vifvy xixxii4 x1e558r4 x1pi30zi xds687c',
  'x78zum5 x1q0g3np xl56j7k x1yztbdb x1y1aw1k',
  'x78zum5 x1q0g3np xl56j7k x1yztbdb x1y1aw1k',
  'x1yztbdb',
  'x9f619 x1ja2u2z xnp8db0 x112wk31 xnjgh8c xxc7z9f x1t2pt76 x1u2d2a2 x6ikm8r x10wlt62 x1xzczws x7wzq59 xxzkxad x9e5oc1',
  'x9f619 x1ja2u2z xnp8db0 x112wk31 xnjgh8c xxc7z9f x1t2pt76 x1u2d2a2 x6ikm8r x10wlt62 x7wzq59 xxzkxad x1daaz14',
  'xixxii4 x1ey2m1c xds687c',
];
const itemsToRemoveById = [
  'MComposer',
  'MStoriesTray',
  // 'MChromeHeader'
];

chrome.runtime.onMessage.addListener((msg: Msg, sender, sendResponse) => {
  if (msg.reload && !stopped) {
    reload();
    sendResponse('Ok, I reload');
  }
  if (msg.restart) {
    stopped = false;
    reload();
    sendResponse('Ok, I restart');
  }
  if (msg.get === 'body') {
    if (document) {
      // window.scrollTo(0, 5000);
      const [e, w] = checkInNodes(document.body.getElementsByTagName('*') as HTMLCollectionOf<HTMLElement>);
      if (!stopped) sendResponse("I'll continue reloading");
      else sendResponse('MATCH FOUND FOR "' + w + '", I stopped reloading');
    } else sendResponse('No document found');
  }

  if (msg.notification) {
    window.Notification.requestPermission();
    sendResponse('Notification sent');
  }
});

const reload = () => {
  window.location.reload();
};

const removeElementByClassName = (className: string) => {
  const toRemove = document.getElementsByClassName(className)[0];
  if (toRemove) toRemove.remove();
};

const removeElementById = (className: string) => {
  const toRemove = document.getElementById(className);
  if (toRemove) toRemove.remove();
};

const resetStats = () => {
  stats.elements = 0;
  stats.filteredElements = 0;
  stats.tabooWordsLoop = 0;
  stats.wordsLoop = 0;
};

const printStats = () => {
  const fe = ((stats.elements - stats.filteredElements) / stats.elements) * 100;
  const ae = (stats.filteredElements / stats.tabooWordsLoop) * 100;
  stats.filteringEfficency = `${fe.toFixed(2)} %`;
  stats.algorithmEfficency = `${ae.toFixed(2)} %`;
  console.table(stats);
};

const checkInNodes = (collection: HTMLCollectionOf<HTMLElement>): [HTMLElement | undefined, string | undefined] => {
  resetStats();
  found = false;
  let elementFound: HTMLElement | undefined = undefined;
  let wordFound: string | undefined = undefined;
  Array.from(collection).forEach((_e) => stats.elements++);
  itemsToRemoveByClassName.forEach((item) => removeElementByClassName(item));
  itemsToRemoveById.forEach((item) => removeElementById(item));
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
      stats.filteredElements++;
      if (!found)
        words.forEach((word) => {
          stats.wordsLoop++;
          if (!found) {
            if (element.textContent && new RegExp(`.*${word}.*`, 'gi').test(element.textContent)) found = true;

            tabooWords.forEach((tabooWord) => {
              stats.tabooWordsLoop++;
              if (element.textContent && new RegExp(`.*${tabooWord}.*`, 'gi').test(element.textContent)) found = false;
            });

            if (found) {
              stopped = true;
              elementFound = element;
              wordFound = word;
              console.log(element);
              focusElement(element);
              sendNotification(element.textContent ?? word, () => focusElement(element));
            }
          }
        });
    });
  printStats();
  return [elementFound, wordFound];
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
