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

japanese.specialHiraganizationTable = {
	'ヿ': 'こと',
	'𪜈': 'とも',
	'𪜈゙': 'ども',
	'ヷ': 'わ゙',
	'ヸ': 'ゐ゙',
	'ヹ': 'ゑ゙',
	'ヺ': 'を゙',
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

module.exports = japanese;
