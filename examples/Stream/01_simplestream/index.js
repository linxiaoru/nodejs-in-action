const fs = require('fs');
const stream = fs.createReadStream('./resource.json');

stream.on('data', function (chunk) {
  console.log(chunk); // <Buffer 7b 0d 0a 20 20 22 6e 61 6d 65 22 3a 20 22 72 65 73 6f 75 72 63 65 22 0d 0a 7d>
});

stream.on('end', function () {
  console.log('finished');
});