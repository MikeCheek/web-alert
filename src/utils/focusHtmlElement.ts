const focusHtmlElement = (element: HTMLElement) => {
  element.style.backgroundColor = 'yellow';
  element.style.border = 'solid red 5px';
  element.style.borderRadius = '10px';
  window.focus();
  window.scrollTo(0, element.getBoundingClientRect().top - 150);
};

export default focusHtmlElement;
