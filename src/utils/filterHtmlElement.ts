const filterHtmlElement = (element: HTMLElement) =>
  element.textContent &&
  !(element instanceof HTMLStyleElement) &&
  !(element instanceof HTMLScriptElement) &&
  !(element instanceof HTMLButtonElement) &&
  !(element instanceof HTMLImageElement) &&
  !(element instanceof HTMLVideoElement) &&
  !(element instanceof HTMLCanvasElement) &&
  element.getElementsByTagName('*').length == 0;

export default filterHtmlElement;
