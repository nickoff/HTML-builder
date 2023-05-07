const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, './secret-folder');

async function getStatsFile(item) {
  const fileStat = await fs.promises.stat(path.join(dirPath, item));
  if (fileStat.isFile()) {
    const fileExtname = path.extname(path.join(dirPath, item));
    console.log(`${path.basename(path.join(dirPath, item), fileExtname)} - ${fileExtname.slice(1, fileExtname.length)} - ${fileStat.size}b`);
  }
}

try {
  (async () => {
    const data = await fs.promises.readdir(dirPath);
    data.forEach((elem) => getStatsFile(elem));
  }
  )();
} catch (err) {
  console.error(err);
}
