'use strict';

var extend = require('extend');

var japanese = {};

japanese.katakanaRegex = new RegExp(
	'(' +
		'[' +
			'\\u30a1-\\u30f4' + // ァ～ヴ
			'\\u30f7-\\u30fa' + // ヷ～ヺ
			'\\u30fd-\\u30ff' + // ヽ～ヿ
		']' +
	'|' +
		'\\ud869\\udf08\\u3099' + // 𪜈゙
	'|' +
		'\\ud869\\udf08' + // 𪜈
	')',
'g');

japanese.hiraganaRegex = new RegExp(
	'[' +
		'\\u3041-\\u3094' + // ぁ～ゔ
		'\\u309d-\\u309f' + // ゝ～ゟ
	']',
'g');

japanese.specialHiraganizationTable = {
	'ヿ': 'こと',
	'𪜈': 'とも',
	'𪜈゙': 'ども',
	'ヷ': 'わ゙',
	'ヸ': 'ゐ゙',
	'ヹ': 'ゑ゙',
	'ヺ': 'を゙',
};

japanese.specialKatakanizationTable = {
	'ゟ': 'ヨリ',
};

japanese.romanizationTable = {

}

japanese.defaultRomanizationConfig = {
	'し': 'shi',
	'ち': 'chi',
	'つ': 'tsu',
	'ふ': 'fu',
	'じ': 'ji',
	'ぢ': 'ji',
	'おう': 'ō',
	'んあ': 'n\'a',
	'んば': 'nba',
	'っち': 'tchi',
	'を': 'o',
	diacritical: true,
};

japanese.romanizationConfigs = {
	kunrei: {
		'し': 'si',
		'ち': 'ti',
		'つ': 'tu',
		'ふ': 'hu',
		'じ': 'zi',
		'ぢ': 'zi',
		'おう': 'ô',
		'っち': 'tti',
	},
	nihon: {
		'し': 'si',
		'ち': 'ti',
		'つ': 'tu',
		'ふ': 'hu',
		'じ': 'di',
		'ぢ': 'di',
		'おう': 'ô',
		'っち': 'tti',
		'を': 'wo',
	},
};

var chr = String.fromCharCode;
var ord = function (char) {
	return char.charCodeAt(0);
};

japanese.hiraganize = function (string) {
	return string.replace(japanese.katakanaRegex, function (katakana) {
		if (katakana.match(/^[\u30a1-\u30f4\u30fd\u30fe]$/)) {
			return chr(ord(katakana) - ord('ァ') + ord('ぁ'));
		} else if (japanese.specialHiraganizationTable[katakana]) {
			return japanese.specialHiraganizationTable[katakana];
		}
	});
};

japanese.katakanize = function (string) {
	return string.replace(japanese.hiraganaRegex, function (hiragana) {
		if (hiragana.match(/^[\u3041-\u3094\u309d\u309e]$/)) {
			return chr(ord(hiragana) - ord('ぁ') + ord('ァ'));
		} else if (japanese.specialKatakanizationTable[hiragana]) {
			return japanese.specialKatakanizationTable[hiragana];
		}
	});
};

japanese.romanize = function (string, config) {
	if (typeof config === 'undefined') {
		config = 'hepburn';
	}

	if (typeof config === 'string') {
		config = japanese.romanizationConfigs[config];

		if (typeof config === 'undefined') {
			throw new ReferenceError('Romanization method ' + config + ' is undefined');
		}
	}

	if (typeof config === 'object') {
		config = extend({}, japanese.defaultRomanizationConfig, config);
	} else {
		throw new Error('You specified unknown config to japanese.romanize');
	}

	return config;
};

module.exports = japanese;
