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
		'  -h, --hiraganize   hiraganize input string',
		'  -k, --katakanize   katakanize input string',
		'  -r, --romanize     romanize input string',
		'',
		'Example',
		'  japanese ヱヴァンゲリヲン --hiraganize'
	].join('\n')
});

if (cli.flags.h || cli.flags.hiraganize) {
	console.log(japanese.hiraganize(cli.input[0]));
} else if (cli.flags.k || cli.flags.katakanize) {
	console.log(japanese.katakanize(cli.input[0]));
} else if (cli.flags.r || cli.flags.romanize) {
	console.log(japanese.romanize(cli.input[0]));
} else {
	console.log(cli.help);
}
