const crypto = require('crypto');
const md5 = crypto.createHash('md5');
var cryptostr = md5.update('Hello, world!').digest('hex');
console.log(cryptostr);
