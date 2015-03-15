'use strict';

var japanese = {};

require('./src/kana.js')(japanese);
require('./src/romanize.js')(japanese);

module.exports = japanese;
