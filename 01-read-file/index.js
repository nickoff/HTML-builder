const { stdout } = process;
const fs = require('fs');
const path = require('path');
const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'));
readStream.on('data', data => stdout.write(data.toString().trim()));
readStream.on('error', err => console.log(err));