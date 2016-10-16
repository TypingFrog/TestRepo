import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';
import util from 'util';

const parser = new xml2js.Parser({
  preserveChildrenOrder: true,
  explicitChildren: true,
});
fs.readFile(path.join(process.cwd(), '/extensions/rainette/theme/main/theme.xml'), (err, data) => {
  console.log('err:', err);
  console.log('data:', data);
  parser.parseString(data, (err2, result) => {
    console.log(util.inspect(result, false, null));
    console.log('Done');
  });
});
