'use strict';

var japanese = {};

require('./src/kana')(japanese);
require('./src/romanize')(japanese);
require('./src/numbers')(japanese);

module.exports = japanese;
