import sax from 'sax';
import readFileWithFrontMatter from './readFileWithFrontMatter';

// reference:
// https://github.com/isaacs/sax-js
// https://github.com/jxson/front-matter
export default function parseXmlFileWithFrontMatter(filePath, notificationHandler) {
  return new Promise((resolve, reject) => {
    readFileWithFrontMatter(filePath)
    .then((content) => {
      const strict = true;
      const options = {};

      const parser = sax.parser(strict, options);

      // we redirect all the notifications to the notification handler
      // TODO: add line number information
      sax.EVENTS.forEach((eventName) => {
        const listenMethod = `on${eventName}`;

        if (eventName === 'end') {
          parser[listenMethod] = (arg) => {
            if (notificationHandler[listenMethod]) {
              notificationHandler[listenMethod].call(notificationHandler, arg);
            }
            return resolve(notificationHandler);
          };
        } else if (notificationHandler[listenMethod]) {
          // we check if the handler is listening to this event
          parser[listenMethod] = (arg) => {
            notificationHandler[listenMethod].call(notificationHandler, arg);
          };
        }
      });
      parser.write(content.body).close();
    })
    .catch((err) => {
      // TODO: enhance error
      return reject(err);
    });
  });
}
