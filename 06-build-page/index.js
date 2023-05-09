const fs = require('fs');
const path = require('path');

const pathDirCss = path.join(__dirname, 'styles');
const pathDirComponents = path.join(__dirname, 'components');
const pathDirAssets = path.join(__dirname, 'assets');
const pathDirBundleAssets = path.join(pathDirAssets, '..', 'project-dist', 'assets');
const pathDirDist = path.join(__dirname, 'project-dist');
const pathTemplateFile = path.join(__dirname, 'template.html');
const fileNameCssBundle = 'style.css';
const fileNameHtmlBundle = 'index.html';
const cssFileExtname = '.css';
const htmlFileExtname = '.html';

async function getComponentsObj(pathToComponentsDir, template) {
  const arrComponentFiles = await fs.promises.readdir(pathToComponentsDir);
  const arrComponentHtmlFiles = arrComponentFiles
    .filter((elem) => path.extname(path.join(pathToComponentsDir, elem)) === htmlFileExtname);
  arrComponentHtmlFiles.forEach(async (elem) => {
    const pathElem = path.join(pathToComponentsDir, elem);
    const component = (await fs.promises.readFile(pathElem)).toString();
    template = template.replace(`{{${path.basename(pathElem, path.extname(pathElem))}}}`, component);
    await fs.promises.writeFile(path.join(pathDirDist, fileNameHtmlBundle), template);
  });
}

async function copyDir(nameDir, newDirName) {
  const itemToDir = await fs.promises.readdir(nameDir);
  await fs.promises.rm(path.join(newDirName), { recursive: true }).catch(() => {});
  await fs.promises.mkdir(newDirName, { recursive: true });
  itemToDir.forEach((elem) => {
    try {
      (async () => {
        const fileStat = await fs.promises.stat(path.join(nameDir, elem));
        if (fileStat.isFile()) {
          await fs.promises.copyFile(path.join(nameDir, elem), path.join(newDirName, elem));
        }
        if (fileStat.isDirectory()) { await copyDir(`${nameDir}\\${elem}`, `${newDirName}\\${elem}`); }
      })();
    } catch (err) {
      console.error(err);
    }
  });
}

try {
  (async () => {
    await fs.promises.mkdir(pathDirDist, { recursive: true });
    const template = (await fs.promises.readFile(pathTemplateFile)).toString();
    await getComponentsObj(pathDirComponents, template);
    copyDir(pathDirAssets, pathDirBundleAssets);

    const arrStyleFiles = await fs.promises.readdir(pathDirCss);
    const arrCssFiles = arrStyleFiles
      .filter((elem) => path.extname(path.join(pathDirCss, elem)) === cssFileExtname);
    const writeStream = fs.createWriteStream(path.join(pathDirDist, fileNameCssBundle));
    arrCssFiles.forEach((elem) => {
      const readStream = fs.createReadStream(path.join(pathDirCss, elem));
      readStream.on('data', (data) => writeStream.write(data));
    });
  }
  )();
} catch (err) {
  console.error(err);
}
