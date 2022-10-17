const removeElementByClassName = (className: string) => {
  const toRemove = document.getElementsByClassName(className)[0];
  if (toRemove) toRemove.remove();
};

const removeElementById = (className: string) => {
  const toRemove = document.getElementById(className);
  if (toRemove) toRemove.remove();
};

export { removeElementByClassName, removeElementById };
