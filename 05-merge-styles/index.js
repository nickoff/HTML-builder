const fs = require('fs');
const path = require('path');

const pathDirCss = path.join(__dirname, './styles');
const pathDirDist = path.join(__dirname, './project-dist');
const fileNameBundle = 'bundle.css';
const cssFileExtname = '.css';

try {
  (async () => {
    const arrStyleFiles = await fs.promises.readdir(pathDirCss);
    const arrCssFiles = arrStyleFiles
      .filter((elem) => path.extname(path.join(pathDirCss, elem)) === cssFileExtname);
    const writeStream = fs.createWriteStream(path.join(pathDirDist, fileNameBundle));
    arrCssFiles.forEach((elem) => {
      const readStream = fs.createReadStream(path.join(pathDirCss, elem));
      readStream.on('data', (data) => writeStream.write(data));
    });
  }
  )();
} catch (err) {
  console.error(err);
}
