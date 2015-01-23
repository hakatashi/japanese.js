#!/usr/bin/env node
'use strict';
var meow = require('meow');
var japanese = require('./');

var cli = meow({
  help: [
    'Usage',
    '  japanese <input>',
    '',
    'Example',
    '  japanese Unicorn'
  ].join('\n')
});

japanese(cli.input[0]);
