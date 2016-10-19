import path from 'path';
import directoryWalker from '../production/input/directoryWalker';

const on = {
  file: (info) => {
    console.log('>file>', info);
  },
  invalidPath: (info) => {
    console.log('>invalidPath>', info);
  },
};

const baseDirectory = path.join(process.cwd(), 'content/tf.post');

directoryWalker(baseDirectory, on)
.then(() => {
  console.log('DONE');
})
.catch((err) => {
  console.log('Err:', err);
});
