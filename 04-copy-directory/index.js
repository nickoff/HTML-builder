const fs = require('fs');
const path = require('path');

async function copyDir(nameDir) {
  const dirPath = path.join(__dirname, nameDir);
  const newDirPath = path.join(`${dirPath}-copy`);
  const data = await fs.promises.readdir(dirPath);
  await fs.promises.mkdir(newDirPath, { recursive: true });
  data.forEach((elem) => {
    try {
      (async () => {
        const fileStat = await fs.promises.stat(path.join(dirPath, elem));
        if (fileStat.isFile()) {
          await fs.promises.copyFile(path.join(dirPath, elem), path.join(newDirPath, elem));
        }
      })();
    } catch (err) {
      console.error(err);
    }
  });
}

try {
  copyDir('files');
} catch (err) {
  console.error(err);
}
