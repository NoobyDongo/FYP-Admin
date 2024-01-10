const fs = require('fs');
const path = require('path');
const generateUniqueHashedString = require('./_generateUniqueHashedString');

function generateUniqueFilename(directory, filename, ext) {
  let uniqueFilename = `${filename}.${ext}`;

  while (fs.existsSync(path.join(directory, uniqueFilename))) {
    uniqueFilename = `${generateUniqueHashedString()}.${ext}`;
  }

  return uniqueFilename;
}
module.exports = generateUniqueFilename;