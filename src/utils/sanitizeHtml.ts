const sanitizeHtml = (html: HTMLElement) => {
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

export default sanitizeHtml;
