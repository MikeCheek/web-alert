import { LOCATION, itemsToRemoveByClassName, itemsToRemoveById, words, tabooWords } from './utils/constants';
import { Msg } from './types';
import checkHref from './utils/checkHref';
import filterHtmlElement from './utils/filterHtmlElement';
import focusHtmlElement from './utils/focusHtmlElement';
import reloadPage from './utils/reloadPage';
import { removeElementByClassName, removeElementById } from './utils/removeElement';
import sendNotification from './utils/sendNotification';
import { createStats, printStats, resetStats } from './utils/stats';

let stopped = false;
let found = false;
const stats = createStats();

chrome.runtime.onMessage.addListener((msg: Msg, sender, sendResponse) => {
  if (msg.reload && !stopped) {
    reloadPage();
    sendResponse('Ok, I reload');
  }
  if (msg.restart) {
    stopped = false;
    reloadPage();
    sendResponse('Ok, I restart');
  }
  if (msg.get === 'body') {
    if (document) {
      // window.scrollTo(0, 5000);
      const location = checkHref();

      const [_elementFound, wordFound] = checkInNodes(
        location === LOCATION.FACEBOOK
          ? document.getElementsByClassName('x1lliihq')
          : location === LOCATION.FACEBOOK_MOBILE
          ? document.getElementsByClassName('story_body_container')
          : document.body.getElementsByTagName('*')
      );
      if (!stopped) sendResponse("I'll continue reloading");
      else sendResponse('MATCH FOUND FOR "' + wordFound + '", I stopped reloading');
    } else sendResponse('No document found');
  }

  if (msg.notification) {
    window.Notification.requestPermission();
    sendResponse('Notification sent');
  }
});

const removeItems = () => {
  itemsToRemoveByClassName.forEach((item) => removeElementByClassName(item));
  itemsToRemoveById.forEach((item) => removeElementById(item));
};

const checkInNodes = (coll: HTMLCollectionOf<Element>): [HTMLElement | undefined, string | undefined] => {
  const start = performance.now();
  console.log('Looking for your words...');
  const collection = coll as HTMLCollectionOf<HTMLElement>;
  found = false;

  let elementFound: HTMLElement | undefined = undefined;
  let wordFound: string | undefined = undefined;

  resetStats(stats);
  removeItems();

  Array.from(collection)
    .filter((element) => {
      stats.elements++;
      if (checkHref() != LOCATION.ANY) return true;
      return filterHtmlElement(element);
    })
    .forEach((element) => {
      stats.filteredElements++;
      if (!found)
        words.forEach((word) => {
          stats.wordsLoop++;
          if (!found) {
            if (element.textContent && new RegExp(`.*${word}.*`, 'gi').test(element.textContent)) found = true;

            if (found)
              tabooWords.forEach((tabooWord) => {
                stats.tabooWordsLoop++;
                if (element.textContent && new RegExp(`.*${tabooWord}.*`, 'gi').test(element.textContent))
                  found = false;
              });

            if (found) {
              stopped = true;
              elementFound = element;
              wordFound = word;
              console.log(element);
              focusHtmlElement(element);
              sendNotification('Found word "' + element.textContent ?? word + '"', () => focusHtmlElement(element));
            }
          }
        });
    });
  const end = performance.now();
  stats.timeRunned = `${((end - start) / 1000).toFixed(2)} s`;
  printStats(stats);
  return [elementFound, wordFound];
};

// chrome.runtime.onConnect.addListener((port) => {
//   if (port.name == 'channelName') {
//     port.onMessage.addListener((response) => {
//       if (response.reload) {
//         window.location.reloadPage();
//       }
//     });
//   }
// });
