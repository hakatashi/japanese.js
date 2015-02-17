'use strict';

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
		} else {
			return katakana;
		}
	});
};

japanese.katakanize = function (string) {
	return string.replace(japanese.hiraganaRegex, function (hiragana) {
		if (hiragana.match(/^[\u3041-\u3094\u309d\u309e]$/)) {
			return chr(ord(hiragana) - ord('ぁ') + ord('ァ'));
		} else if (japanese.specialKatakanizationTable[hiragana]) {
			return japanese.specialKatakanizationTable[hiragana];
		} else {
			return hiragana;
		}
	});
};

module.exports = japanese;
