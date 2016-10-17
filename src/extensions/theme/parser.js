import path from 'path';
import util from 'util';

import parseXmlFileWithFrontMatter from '../../util/parseXmlFileWithFrontMatter';

const notificationHandler = (context) => {
  const _context = context;

  return {
    context() {
      return _context;
    },

    onerror: (err) => {
      // an error happened.
      // unhandled errors will throw, since this is a proper node
      // event emitter.
      console.error('error!', err);
      // clear the error
      this._parser.error = null;
      this._parser.resume();
    },

    ontext: (text) => {
      // got some text.  t is the string of text.
      console.log('>ontext>:', text);
    },

    onopentag: (node) => {
      // opened a tag.  node has "name" and "attributes"
      _context.hello += 1;
      console.log('>onopentag>:', node, context);
    },

    onattribute: (attr) => {
      // an attribute.  attr has "name" and "value"
      console.log('>onattribute>:', attr);
    },

    onend: () => {
      // parser stream is done, and ready to have more stuff written to it.
      console.log('>onend>:');
    },
  };
};

const context = {
  hello: 1,
};

const filePath = path.join(process.cwd(), '/extensions/com.typingfrog.rainette/theme/template/navigation-menu.html');

parseXmlFileWithFrontMatter(filePath, notificationHandler(context))
.then((handler) => {
  console.log('DONE:', handler.context());
})
.catch((err) => {
  console.log('Err:', util.inspect(err, { showHidden: true, depth: null }), err.stack);
});
