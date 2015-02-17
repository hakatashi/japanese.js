#!/usr/bin/env node
'use strict';
var meow = require('meow');
var japanese = require('./');

var cli = meow({
    help: [
        'Usage:',
        '  japanese <input> [options]',
        '',
        'Options:',
        '  -H, --hiraganize   Hiraganize input string',
        '  -K, --katakanize   katakanize input string',
        '',
        'Example',
        '  japanese ヱヴァンゲリヲン --hiraganize'
    ].join('\n')
});

if (cli.flags.H || cli.flags.hiraganize) {
    console.log(japanese.hiraganize(cli.input[0]));
} else if (cli.flags.K || cli.flags.katakanize) {
    console.log(japanese.katakanize(cli.input[0]));
} else {
    console.log(cli.input[0]);
}
