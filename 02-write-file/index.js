const readline = require('readline');
const fs = require('fs');
const path = require('path');

const {
  stdin: input,
  stdout: output,
} = process;

output.write('Write something here, for exit type "exit" or press Ctrl+C.\n');
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const readLine = readline.createInterface({ input, output });
readLine.on('line', (chunk) => {
  if (chunk.toString().trim() === 'exit') {
    process.exit();
  } else { writeStream.write(`${chunk}\n`); }
});

process.on('exit', () => {
  output.write('Bye! Bye!');
  readLine.close();
});