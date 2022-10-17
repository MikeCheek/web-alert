const sendNotification = (text: string, action: () => void) => {
  if ('Notification' in window) {
    if (window.Notification.permission != 'granted')
      window.Notification.requestPermission().then((permission) => {
        if (permission === 'granted') new window.Notification(text).addEventListener('click', () => action());
      });
    else if (window.Notification.permission === 'granted')
      new window.Notification(text).addEventListener('click', () => action());
  }
};

export default sendNotification;
