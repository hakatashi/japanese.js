var japanese = require('./');

var methods = [
	'hiraganize',
	'katakanize',
	'romanize',
];

methods.forEach(function (method) {
	Object.defineProperty(String.prototype, method, {
		value: function () {
			return japanese[method].apply(this, [this].concat(arguments));
		},
		enumerable: false,
		configurable: true,
		writable: true,
	});
});

module.exports = japanese;
