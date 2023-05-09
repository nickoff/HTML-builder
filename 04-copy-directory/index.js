const fs = require('fs');
const path = require('path');

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
        if (fileStat.isDirectory()) { await copyDir(path.join(`${nameDir}`, `${elem}`), path.join(`${newDirName}`, `${elem}`)); }
      })();
    } catch (err) {
      console.error(err);
    }
  });
}

try {
  const dirPath = path.join(__dirname, 'files');
  const newDirPath = path.join(`${dirPath}-copy`);
  copyDir(dirPath, newDirPath);
} catch (err) {
  console.error(err);
}