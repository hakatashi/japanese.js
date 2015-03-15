'use strict';

var japanese = {};

require('./src/kana.js')(japanese);
require('./src/romanize.js')(japanese);
require('./src/numbers.js')(japanese);

module.exports = japanese;
