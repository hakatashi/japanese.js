(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
	'あ': 'a',
	'い': 'i',
	'う': 'u',
	'え': 'e',
	'お': 'o',
	'か': 'ka',
	'き': 'ki',
	'く': 'ku',
	'け': 'ke',
	'こ': 'ko',
	'さ': 'sa',
	'し': 'si',
	'す': 'su',
	'せ': 'se',
	'そ': 'so',
	'た': 'ta',
	'ち': 'ti',
	'つ': 'tu',
	'て': 'te',
	'と': 'to',
	'な': 'na',
	'に': 'ni',
	'ぬ': 'nu',
	'ね': 'ne',
	'の': 'no',
	'は': 'ha',
	'ひ': 'hi',
	'ふ': 'hu',
	'へ': 'he',
	'ほ': 'ho',
	'ま': 'ma',
	'み': 'mi',
	'む': 'mu',
	'め': 'me',
	'も': 'mo',
	'や': 'ya',
	'ゆ': 'yu',
	'よ': 'yo',
	'ら': 'ra',
	'り': 'ri',
	'る': 'ru',
	'れ': 're',
	'ろ': 'ro',
	'わ': 'wa',
	'ゐ': 'wi',
	'ゑ': 'we',
	'を': 'wo',
	'ん': 'n',
	'が': 'ga',
	'ぎ': 'gi',
	'ぐ': 'gu',
	'げ': 'ge',
	'ご': 'go',
	'ざ': 'za',
	'じ': 'zi',
	'ず': 'zu',
	'ぜ': 'ze',
	'ぞ': 'zo',
	'だ': 'da',
	'ぢ': 'di',
	'づ': 'du',
	'で': 'de',
	'ど': 'do',
	'ば': 'ba',
	'び': 'bi',
	'ぶ': 'bu',
	'べ': 'be',
	'ぼ': 'bo',
	'ゔ': 'vu',
	'ぱ': 'pa',
	'ぴ': 'pi',
	'ぷ': 'pu',
	'ぺ': 'pe',
	'ぽ': 'po',
	'きゃ': 'kya',
	'きゅ': 'kyu',
	'きぇ': 'kye',
	'きょ': 'kyo',
	'しゃ': 'sya',
	'しゅ': 'syu',
	'しぇ': 'sye',
	'しょ': 'syo',
	'ちゃ': 'tya',
	'ちゅ': 'tyu',
	'ちぇ': 'tye',
	'ちょ': 'tyo',
	'にゃ': 'nya',
	'にゅ': 'nyu',
	'にぇ': 'nye',
	'にょ': 'nyo',
	'ひゃ': 'hya',
	'ひゅ': 'hyu',
	'ひぇ': 'hye',
	'ひょ': 'hyo',
	'みゃ': 'mya',
	'みゅ': 'my',
	'みぇ': 'mye',
	'みょ': 'myo',
	'りゃ': 'rya',
	'りゅ': 'ryu',
	'りぇ': 'rye',
	'りょ': 'ryo',
	'ぎゃ': 'gya',
	'ぎゅ': 'gyu',
	'ぎぇ': 'gye',
	'ぎょ': 'gyo',
	'じゃ': 'zya',
	'じゅ': 'zyu',
	'じぇ': 'zye',
	'じょ': 'zyo',
	'ぢゃ': 'dya',
	'ぢゅ': 'dyu',
	'ぢぇ': 'dye',
	'ぢょ': 'dyo',
	'びゃ': 'bya',
	'びゅ': 'byu',
	'びぇ': 'bye',
	'びょ': 'byo',
	'ゔぁ': 'va',
	'ゔぃ': 'vi',
	'ゔぇ': 've',
	'ゔぉ': 'vo',
	'ぴゃ': 'pya',
	'ぴゅ': 'pyu',
	'ぴぇ': 'pye',
	'ぴょ': 'pyo',
	/*
	 * Rarely used character combinations
	 *
	 * These romanizations are normally not defined in most specifications and
	 * very hard to verify therefore.
	 * In this library, most of the codes are derived from following Wikipedia article.
	 * http://en.wikipedia.org/wiki/Hepburn_romanization#For_extended_katakana
	 */
	'いぃ': 'yi',
	'いぇ': 'ye',
	'うぁ': 'wa',
	'うぃ': 'wi',
	'うぅ': 'wu',
	'うぇ': 'we',
	'うぉ': 'wo',
	'うゅ': 'wyu',
	'ゔゃ': 'vya',
	'ゔゅ': 'vyu',
	'ゔょ': 'vyo',
	'くぁ': 'kwa',
	'くぃ': 'kwi',
	'くぅ': 'kwu',
	'くぇ': 'kwe',
	'くぉ': 'kwo',
	'くゎ': 'kwa',
	'ぐぁ': 'gwa',
	'ぐぃ': 'gwi',
	'ぐぅ': 'gwu',
	'ぐぇ': 'gwe',
	'ぐぉ': 'gwo',
	'ぐゎ': 'gwa',
	'すぃ': 'si',
	'ずぃ': 'zi',
	'つぁ': 'tua',
	'つぃ': 'tui',
	'つぇ': 'tue',
	'つぉ': 'tuo',
	'つゅ': 'tuyu',
	'づぁ': 'dua',
	'づぃ': 'dui',
	'づぇ': 'due',
	'づぉ': 'duo',
	'てゃ': 'tea',
	'てぃ': 'tei',
	'てゅ': 'teu',
	'てぇ': 'tee',
	'てょ': 'teo',
	'とぅ': 'tou',
	'でゃ': 'dea',
	'でぃ': 'dei',
	'でゅ': 'deu',
	'でぇ': 'dee',
	'でょ': 'deo',
	'どぅ': 'dou',
	'ふぁ': 'hua',
	'ふぃ': 'hui',
	'ふぇ': 'hue',
	'ふぉ': 'huo',
	'ふゃ': 'huya',
	'ふゅ': 'huyu',
	'ふょ': 'huyo',
	'ほぅ': 'hu',
	'ら゚': 'la',
	'り゚': 'li',
	'る゚': 'lu',
	'れ゚': 'le',
	'ろ゚': 'lo',
	'わ゙': 'va',
	'ゐ゙': 'vi',
	'ゑ゙': 've',
	'を゙': 'vo',
	'ぁ': 'a',
	'ぃ': 'i',
	'ぅ': 'u',
	'ぇ': 'e',
	'ぉ': 'o',
	'ゃ': 'ya',
	'ゅ': 'yu',
	'ょ': 'yo',
	'っ': 'tu',
	'ゎ': 'wa',
	'ヵ': 'ka',
	'ヶ': 'ke',
};

japanese.romanizePuncutuationTable = {
	'。': '.',
	'、': ',',
	'・': '-',
	'－': '-',
	'「': '“',
	'」': '”',
	'（': '(',
	'）': ')',
	'　': ' ',
	' ': ' ',
};

japanese.defaultRomanizationConfig = {
	'し': 'shi',
	'ち': 'chi',
	'つ': 'tsu',
	'ふ': 'fu',
	'じ': 'ji',
	'ぢ': 'ji',
	'づ': 'zu',
	'ああ': 'aa',
	'いい': 'ii',
	'うう': 'ū',
	'ええ': 'ee',
	'おお': 'ō',
	'あー': 'ā',
	'えい': 'ei',
	'おう': 'ō',
	'んあ': 'n\'a',
	'んば': 'nba',
	'っち': 'tchi',
	'ゐ': 'i',
	'を': 'o',
	punctuation: true,
};

japanese.romanizationConfigs = {
	wikipedia: {},
	'traditional hepburn': {
		'を': 'wo',
		'んあ': 'n-a',
		'んば': 'mba',
	},
	'modified hepburn': {
		'ああ': 'ā',
		'いい': 'ii',
		'うう': 'ū',
		'ええ': 'ē',
		'おお': 'ō',
	},
	kunrei: {
		'し': 'si',
		'ち': 'ti',
		'つ': 'tu',
		'ふ': 'hu',
		'じ': 'zi',
		'ぢ': 'zi',
		'づ': 'zu',
		'ああ': 'â',
		'いい': 'î',
		'うう': 'û',
		'ええ': 'ê',
		'おお': 'ô',
		'あー': 'â',
		'おう': 'ô',
		'っち': 'tti',
	},
	nihon: {
		'し': 'si',
		'ち': 'ti',
		'つ': 'tu',
		'ふ': 'hu',
		'じ': 'zi',
		'ぢ': 'di',
		'づ': 'du',
		'ああ': 'ā',
		'いい': 'ī',
		'うう': 'ū',
		'ええ': 'ē',
		'おお': 'ō',
		'あー': 'ā',
		'おう': 'ō',
		'っち': 'tti',
		'ゐ': 'wi',
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
		config = 'wikipedia';
	}

	if (typeof config === 'string') {
		config = japanese.romanizationConfigs[config];

		if (typeof config === 'undefined') {
			throw new ReferenceError('Romanization method "' + config + '" is undefined');
		}
	}

	if (typeof config === 'object') {
		config = extend({}, japanese.defaultRomanizationConfig, config);
	} else {
		throw new Error('You specified unknown config to japanese.romanize');
	}

	var table = extend({}, japanese.romanizationTable);

	if (config['し'] === 'shi') {
		extend(table, {
			'し': 'shi',
			'しゃ': 'sha',
			'しゅ': 'shu',
			'しぇ': 'she',
			'しょ': 'sho',
		});
	}

	if (config['ち'] === 'chi') {
		extend(table, {
			'ち': 'chi',
			'ちゃ': 'cha',
			'ちゅ': 'chu',
			'ちぇ': 'che',
			'ちょ': 'cho',
			'てぃ': 'ti',
			'てゅ': 'tyu',
		});
	}

	if (config['つ'] === 'tsu') {
		extend(table, {
			'つ': 'tsu',
			'つぁ': 'tsa',
			'つぃ': 'tsi',
			'つぇ': 'tse',
			'つぉ': 'tso',
			'つゅ': 'tsyu',
			'とぅ': 'tu',
		});
	}

	if (config['ふ'] === 'fu') {
		extend(table, {
			'ふ': 'fu',
			'ふぁ': 'fa',
			'ふぃ': 'fi',
			'ふぇ': 'fe',
			'ふぉ': 'fo',
			'ふゃ': 'fya',
			'ふゅ': 'fyu',
			'ふょ': 'fyo',
		});
	}

	if (config['じ'] === 'ji') {
		extend(table, {
			'じ': 'ji',
			'じゃ': 'ja',
			'じゅ': 'ju',
			'じぇ': 'je',
			'じょ': 'jo',
		});
	}

	if (config['ぢ'] === 'ji') {
		extend(table, {
			'ぢ': 'ji',
			'ぢゃ': 'ja',
			'ぢゅ': 'ju',
			'ぢぇ': 'je',
			'ぢょ': 'jo',
			'でぃ': 'di',
			'でゅ': 'dyu',
		});
	}

	if (config['ぢ'] === 'zi') {
		extend(table, {
			'ぢ': 'zi',
			'ぢゃ': 'zya',
			'ぢゅ': 'zyu',
			'ぢぇ': 'zye',
			'ぢょ': 'zyo',
			'でぃ': 'di',
			'でゅ': 'dyu',
		});
	}

	if (config['づ'] === 'zu') {
		extend(table, {
			'づ': 'zu',
			'づぁ': 'zua',
			'づぃ': 'zui',
			'づぇ': 'zue',
			'づぉ': 'zuo',
			'どぅ': 'du',
		});
	}

	if (config['ゐ'] === 'i') {
		extend(table, {
			'ゐ': 'i',
			'ゑ': 'e',
		});
	}

	if (config['を'] === 'o') {
		extend(table, {
			'を': 'o',
		});
	}

	string = japanese.hiraganize(string);

	var dest = '';
	var previousToken = '';

	while (string.length > 0) {
		var token = '';

		// assuming we have only one or two letter token in table
		if (table[string.slice(0, 2)]) {
			token = string.slice(0, 2);
			string = string.slice(2);
		} else {
			token = string[0];
			string = string.slice(1);
		}

		// handle small tsu
		if (token === 'っ') {
			previousToken = token;
			continue;
		}

		var tokenDest = table[token] || '';

		// small tsu
		if (previousToken === 'っ') {
			if (tokenDest.match(/^[^aiueo]/)) {
				if (token[0] === 'ち') {
					if (config['っち'] === 'tchi') {
						tokenDest = {
							'ち': 'tchi',
							'ちゃ': 'tcha',
							'ちゅ': 'tchu',
							'ちぇ': 'tche',
							'ちょ': 'tcho',
						}[token];
					} else if (config['っち'] === 'cchi') {
						tokenDest = {
							'ち': 'cchi',
							'ちゃ': 'ccha',
							'ちゅ': 'cchu',
							'ちぇ': 'cche',
							'ちょ': 'ccho',
						}[token];
					} else { // normally 'tti'
						tokenDest = {
							'ち': 'tti',
							'ちゃ': 'ttya',
							'ちゅ': 'ttyu',
							'ちぇ': 'ttye',
							'ちょ': 'ttyo',
						}[token];
					}
				} else {
					tokenDest = tokenDest[0] + tokenDest;
				}
			} else {
				/*
				 * Some article claims that "ローマ字教育の指針(文部科学省)" defines that
				 * strings ending with "っ" must be represented with trailing apostrophe
				 * though I couldn't confirm.
				 */
				dest += '\'';
			}
		}

		// long vowel
		if (token === 'ー') {
			if (dest.match(/[aiueo]$/)) {
				if (config['あー'] === 'a') {
					// nope
				} else if (config['あー'] === 'ah') {
					dest += 'h';
				} else if (config['あー'] === 'a-') {
					dest += '-';
				} else if (config['あー'] === 'aa') {
					dest = dest.slice(0, -1) + {
						'a': 'aa',
						'i': 'ii',
						'u': 'uu',
						'e': 'ee',
						'o': 'oo',
					}[dest.slice(-1)];
				} else if (config['あー'] === 'â') {
					dest = dest.slice(0, -1) + {
						'a': 'â',
						'i': 'î',
						'u': 'û',
						'e': 'ê',
						'o': 'ô',
					}[dest.slice(-1)];
				} else if (config['あー'] === 'ā') {
					dest = dest.slice(0, -1) + {
						'a': 'ā',
						'i': 'ī',
						'u': 'ū',
						'e': 'ē',
						'o': 'ō',
					}[dest.slice(-1)];
				}

				tokenDest = '';
			} else {
				tokenDest = '-';
			}
		} else if (dest.slice(-1) === 'e' && tokenDest[0] === 'i') {
			tokenDest = tokenDest.slice(1);

			if (config['えい'] === 'ei') {
				dest += 'i';
			} else if (config['えい'] === 'ee') {
				dest += 'e';
			} else if (config['えい'] === 'eh') {
				dest += 'h';
			} else if (config['えい'] === 'ê') {
				dest = dest.slice(0, -1) + 'ê';
			} else if (config['えい'] === 'ē') {
				dest = dest.slice(0, -1) + 'ē';
			} else if (config['えい'] === 'e') {
				// nope
			}
		} else if (dest.slice(-1) === 'o' && tokenDest[0] === 'u') {
			tokenDest = tokenDest.slice(1);

			if (config['おう'] === 'ou') {
				dest += 'u';
			} else if (config['おう'] === 'oo') {
				dest += 'o';
			} else if (config['おう'] === 'oh') {
				dest += 'h';
			} else if (config['おう'] === 'ô') {
				dest = dest.slice(0, -1) + 'ô';
			} else if (config['おう'] === 'ō') {
				dest = dest.slice(0, -1) + 'ō';
			} else if (config['おう'] === 'o') {
				// nope
			}
		} else if (dest.match(/[aiueo]$/) && dest.slice(-1) === tokenDest[0] && token !== 'を') {
			tokenDest = tokenDest.slice(1);

			dest = dest.slice(0, -1) + config[{
				'a': 'ああ',
				'i': 'いい',
				'u': 'うう',
				'e': 'ええ',
				'o': 'おお',
			}[dest.slice(-1)]];
		}

		// んば
		if (tokenDest.match(/^[bpm]/) && previousToken === 'ん') {
			if (config['んば'] === 'nba') {
				// nope
			} else if (config['んば'] === 'mba') {
				dest = dest.slice(0, -1) + 'm';
			}
		}

		// んあ
		if (tokenDest.match(/^[aiueoy]/) && previousToken === 'ん') {
			if (config['んあ'] === 'na') {
				// nope
			} else if (config['んあ'] === 'n\'a') {
				tokenDest = '\'' + tokenDest;
			} else if (config['んあ'] === 'n-a') {
				tokenDest = '-' + tokenDest;
			}
		}

		if (config.punctuation && japanese.romanizePuncutuationTable[token]) {
			tokenDest = japanese.romanizePuncutuationTable[token];
		}

		dest += tokenDest;

		previousToken = token;
	}

	if (previousToken === 'っ') {
		dest += '\'';
	}

	return dest;
};

module.exports = japanese;

},{"extend":2}],2:[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;
var undefined;

var isPlainObject = function isPlainObject(obj) {
	'use strict';
	if (!obj || toString.call(obj) !== '[object Object]') {
		return false;
	}

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}

	return key === undefined || hasOwn.call(obj, key);
};

module.exports = function extend() {
	'use strict';
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

				// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}]},{},[1]);
