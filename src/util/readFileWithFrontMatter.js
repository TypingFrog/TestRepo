import fs from 'fs';
import fm from 'front-matter';

// reference:
// https://github.com/jxson/front-matter
export default function readFileWithFrontMatter(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }

      const content = fm(data);
      return resolve(content);
    });
  });
}
