'use strict';

var extend = require('extend');
var Big = require('big.js');

// Get nth bit from buffer
function getBit(buffer, position) {
	var byteIndex = Math.floor(position / 8);
	var byte = buffer[byteIndex] || 0;

	return !!(byte & (1 << (7 - position % 8)));
}

// Get bits of buffer from a to b
function getBits(buffer, from, length) {
	var ret = new Big(0);

	for (var ptr = from; ptr < from + length; ptr++) {
		ret = ret.times(2);
		if (getBit(buffer, ptr)) {
			ret = ret.plus(1);
		}
	}

	return ret;
}

// Polyfill Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER
if (!Number.MAX_SAFE_INTEGER) {
	Number.MAX_SAFE_INTEGER = 9007199254740991;
}
if (!Number.MIN_SAFE_INTEGER) {
	Number.MIN_SAFE_INTEGER = -9007199254740991;
}

module.exports = function (japanese) {
	japanese.transcriptionConfigs = {
		'default': {
			minusSign: 'マイナス',
			decimalPoint: '・',
			digits: 'common',
			unitNames: 'jinkoki3',
			specialUnitNames: 'none',
			truncateOne: ['十', '百', '千', '拾', '佰', '阡', '仟'],
			smallUnitNames: 'none',
		},
		formal: {
			digits: 'formal',
			unitNames: 'formal',
			specialUnitNames: 'common',
			smallUnitNames: 'common',
		},
		traditional: {
			digits: 'traditional',
			specialUnitNames: 'full',
			smallUnitNames: 'full',
		},
	};

	japanese.predefineedTranscriptionConfigs = {
		digits: {
			arabic: {
				0: '0',
				1: '1',
				2: '2',
				3: '3',
				4: '4',
				5: '5',
				6: '6',
				7: '7',
				8: '8',
				9: '9',
			},
			common: {
				0: '〇',
				1: '一',
				2: '二',
				3: '三',
				4: '四',
				5: '五',
				6: '六',
				7: '七',
				8: '八',
				9: '九',
			},
			formal: {
				0: '〇',
				1: '壱',
				2: '弐',
				3: '参',
				4: '四',
				5: '五',
				6: '六',
				7: '七',
				8: '八',
				9: '九',
			},
			traditional: {
				0: '零',
				1: '壱',
				2: '弐',
				3: '参',
				4: '肆',
				5: '伍',
				6: '陸',
				7: '柒',
				8: '捌',
				9: '玖',
			},
			traditionalOld: {
				0: '零',
				1: '壹',
				2: '貳',
				3: '參',
				4: '肆',
				5: '伍',
				6: '陸',
				7: '柒',
				8: '捌',
				9: '玖',
			},
			simplified: {
				0: '零',
				1: '壹',
				2: '贰',
				3: '叁',
				4: '肆',
				5: '伍',
				6: '陆',
				7: '柒',
				8: '捌',
				9: '玖',
			},
			chineseMilitary: {
				0: '洞',
				1: '幺',
				2: '两',
				3: '三',
				4: '刀',
				5: '五',
				6: '六',
				7: '拐',
				8: '八',
				9: '勾',
			},
			vietnam: {
				0: '〇',
				1: '𠬠',
				2: '𠄩',
				3: '𠀧',
				4: '𦊚',
				5: '𠄼',
				6: '𦒹',
				7: '𦉱',
				8: '𠔭',
				9: '𠃩',
			},
		},
		unitNames: {
			jinkoki1: {
				1: '十',
				2: '百',
				3: '千',
				4: '万',
				5: '億',
				6: '兆',
				7: '京',
				8: '垓',
				9: '𥝱',
				10: '穣',
				11: '溝',
				12: '澗',
				13: '正',
				14: '載',
				15: '極',
				23: '恒河沙',
				31: '阿僧祇',
				39: '那由他',
				47: '不可思議',
				55: '無量大数',
				lit: 63,
			},
			jinkoki2: {
				1: '十',
				2: '百',
				3: '千',
				4: '万',
				8: '億',
				12: '兆',
				16: '京',
				20: '垓',
				24: '𥝱',
				28: '穣',
				32: '溝',
				36: '澗',
				40: '正',
				44: '載',
				48: '極',
				56: '恒河沙',
				64: '阿僧祇',
				72: '那由他',
				80: '不可思議',
				88: '無量大数',
				lit: 96,
			},
			jinkoki3: {
				1: '十',
				2: '百',
				3: '千',
				4: '万',
				8: '億',
				12: '兆',
				16: '京',
				20: '垓',
				24: '𥝱',
				28: '穣',
				32: '溝',
				36: '澗',
				40: '正',
				44: '載',
				48: '極',
				52: '恒河沙',
				56: '阿僧祇',
				60: '那由他',
				64: '不可思議',
				68: '無量大数',
				lit: 72,
			},
			josu: {
				1: '十',
				2: '百',
				3: '千',
				4: '万',
				8: '億',
				16: '兆',
				32: '京',
				64: '垓',
				128: '𥝱',
				256: '穣',
				512: '溝',
				1024: '澗',
				2048: '正',
				4096: '載',
				8192: '極',
				16384: '恒河沙',
				32768: '阿僧祇',
				65536: '那由他',
				131072: '不可思議',
				262144: '無量大数',
				lit: 524288,
			},
			formal: {
				1: '拾',
				2: '百',
				3: '千',
				4: '万',
				8: '億',
				12: '兆',
				16: '京',
				20: '垓',
				24: '𥝱',
				28: '穣',
				32: '溝',
				36: '澗',
				40: '正',
				44: '載',
				48: '極',
				52: '恒河沙',
				56: '阿僧祇',
				60: '那由他',
				64: '不可思議',
				68: '無量大数',
				lit: 72,
			},
		},
		specialUnitNames: {
			none: {},
			common: {
				20: '廿',
				30: '卅',
			},
			full: {
				20: '廿',
				30: '卅',
				40: '卌',
				200: '皕',
			},
		},
		smallUnitNames: {
			none: {},
			common: {
				1: '分',
				2: '厘',
				3: '毛',
				4: '糸',
			},
			wari: {
				1: '割',
				2: '分',
				3: '厘',
				4: '毛',
				5: '糸',
			},
			full: {
				1: '分',
				2: '厘',
				3: '毛',
				4: '糸',
				5: '忽',
				6: '微',
				7: '繊',
				8: '沙',
				9: '塵',
				10: '埃',
				11: '渺',
				12: '漠',
				13: '模糊',
				14: '逡巡',
				15: '須臾',
				16: '瞬息',
				17: '弾指',
				18: '刹那',
				19: '六徳',
				20: '虚空',
				21: '清浄',
			},
			wariFull: {
				1: '割',
				2: '分',
				3: '厘',
				4: '毛',
				5: '糸',
				6: '忽',
				7: '微',
				8: '繊',
				9: '沙',
				10: '塵',
				11: '埃',
				12: '渺',
				13: '漠',
				14: '模糊',
				15: '逡巡',
				16: '須臾',
				17: '瞬息',
				18: '弾指',
				19: '刹那',
				20: '六徳',
				21: '虚空',
				22: '清浄',
			},
		},
	};

	japanese.transcribeNumber = function (number, config) {
		if (typeof config === 'undefined') {
			// default config
			config = japanese.transcriptionConfigs['default'];
		}

		if (typeof config === 'string') {
			config = japanese.transcriptionConfigs[config];

			if (typeof config === 'undefined') {
				throw new ReferenceError('Transcription method "' + config + '" is undefined');
			}
		}

		if (typeof config === 'object') {
			config = extend({}, japanese.transcriptionConfigs['default'], config);
		} else {
			throw new Error('You specified unknown config to japanese.transcribeNumber');
		}

		if (typeof config.digits === 'string') {
			config.digits = japanese.predefineedTranscriptionConfigs.digits[config.digits];

			if (typeof config.digits === 'undefined') {
				throw new ReferenceError('Transcription method of digits "' + config.digits + '" is undefined');
			}
		}

		if (typeof config.unitNames === 'string') {
			config.unitNames = japanese.predefineedTranscriptionConfigs.unitNames[config.unitNames];

			if (typeof config.unitNames === 'undefined') {
				throw new ReferenceError('Transcription method of unitNames "' + config.unitNames + '" is undefined');
			}
		}

		if (typeof config.specialUnitNames === 'string') {
			config.specialUnitNames = japanese.predefineedTranscriptionConfigs.specialUnitNames[config.specialUnitNames];

			if (typeof config.specialUnitNames === 'undefined') {
				throw new ReferenceError('Transcription method of specialUnitNames "' + config.specialUnitNames + '" is undefined');
			}
		}

		if (typeof config.smallUnitNames === 'string') {
			config.smallUnitNames = japanese.predefineedTranscriptionConfigs.smallUnitNames[config.smallUnitNames];

			if (typeof config.smallUnitNames === 'undefined') {
				throw new ReferenceError('Transcription method of smallUnitNames "' + config.smallUnitNames + '" is undefined');
			}
		}

		// Unify input to string

		if (typeof number === 'number') {
			if (Number.MIN_SAFE_INTEGER <= number && number < Number.MAX_SAFE_INTEGER) {
				number = number.toString();
			} else {
				// Paste number into binary form
				var buf = new Buffer(8);
				buf.writeDoubleBE(number, 0);

				var sign = getBit(buf, 0);
				var exponent = getBits(buf, 1, 11);
				var mantissa = getBits(buf, 12, 52);
				var fraction = null;

				exponent = parseInt(exponent.toString());

				if (exponent === 0) {
					fraction = mantissa;
					exponent = 1;
				} else {
					fraction = (new Big(2)).pow(52).plus(mantissa);
				}

				number = fraction.times((new Big(2)).pow(exponent - 1023 - 52)).toFixed();

				if (sign) {
					number = '-' + number;
				}
			}
		} else if (typeof number !== 'string') {
			throw new ReferenceError('Type of `number` is unsupported');
		}

		var length = number.length;

		// Main convertion starts here

		var lit = '';
		var restoreZero = false;
		if (config.unitNames.lit && length > config.unitNames.lit) {
			lit = number.slice(0, -config.unitNames.lit).split('').map(function (digit) {
				return config.digits[digit];
			}).join('');

			number = number.slice(-config.unitNames.lit);
			length = number.length;
			if (number[0] === '0') {
				restoreZero = true;
				number = '9' + number.slice(1);
			}
		}

		// handle zero
		if (number === '0') {
			return config.digits[0];
		}

		var transcription = '';

		if (number.slice(-1) !== '0') {
			transcription += config.digits[number.slice(-1)];
		}

		// Get sanitized unit name keys
		var keysOfUnitNames = Object.keys(config.unitNames).map(function (key) {
			// convert to int
			return parseInt(key);
		}).filter(function (key, index, self) {
			// unique
			return self.indexOf(key) === index;
		}).filter(function (key) {
			// validate
			return isFinite(key) && key > 0;
		}).sort(function (a, b) {
			// asc sort
			return a - b;
		});

		keysOfUnitNames.forEach(function (key, index) {
			var nextKey = keysOfUnitNames[index + 1] || Infinity;
			// slice the digits spaned by the unit name
			var token = number.slice(Math.max(length - nextKey, 0), Math.max(length - key, 0));

			if (token.length > 0) {
				// check if every number in the token is zero
				if (!token.split('').every(function (digit) { return digit === '0'; })) {
					// truncateOne
					if (config.truncateOne.indexOf(config.unitNames[key]) !== -1 && parseInt(token) === 1) {
						transcription = config.unitNames[key] + transcription;
					} else {
						transcription = japanese.transcribeNumber(token, config) + config.unitNames[key] + transcription;
					}
				}
			}
		});

		// Rejoin lit tokens
		if (restoreZero) {
			transcription = transcription.replace(new RegExp('^' + config.digits[9]), config.digits[0]);
		}
		transcription = lit + transcription;

		return transcription;
	};

	return japanese;
};
