import fs from 'fs';
import path from 'path';
import _ from 'lodash';

function readDirectory(currentPath, relativePath, on, options, level) {
  return new Promise((resolve, reject) => {
    // we check first that we are indeed in a directory
    fs.stat(currentPath, (err, stats) => {
      if (err) {
        return reject(err);
      }
      if (!stats.isDirectory()) {
        return reject(new Error(`Not a directory: ${currentPath}`));
      }

      // we can read the content of the directory
      fs.readdir(currentPath, (err2, files) => {
        if (err2) {
          return reject(err2);
        }
        files.reduce((promise, fileName) => {
          return promise.then(() => {
            if (level === options.nbDirectoryLevel) {
              // we are in the content fileDirectory
              const found = fileName.match(options.contentFileRegexp);

              if (found) {
                return on.file({
                  fileName,
                  languageExtension: found[1],
                  absolutePath: path.join(currentPath, fileName),
                  relativePath: path.join(relativePath, fileName),
                });
              }
              return on.invalidPath({
                fileName,
                absolutePath: path.join(currentPath, fileName),
                relativePath: path.join(relativePath, fileName),
              });
            } else if (fileName.match(options.directoryRegexp)) {
              return readDirectory(
                path.join(currentPath, fileName),
                path.join(relativePath, fileName),
                on,
                options,
                level + 1);
            }
            return on.invalidPath({
              fileName,
              absolutePath: path.join(currentPath, fileName),
              relativePath: path.join(relativePath, fileName),
            });
          });
        }, Promise.resolve(true))
        .then(() => {
          // all files have been processed
          return resolve(true);
        })
        .catch((err3) => {
          return reject(err3);
        });
      });
    });
  });
}

export default function directoryParser(baseDirectory, on, _options = {}) {
  const options = _.defaults(_options, {
    nbDirectoryLevel: 3,
    directoryRegexp: /^[0-9]{3}$/,
    contentFileRegexp: /^content\.([^.]*)\.md$/,
  });

  return readDirectory(baseDirectory, '', on, options, 0);
}
