/**
 * japanese.js - Util collection for Japanese text processing. Hiraganize, Katakanize, and Romanize.
 * @version v1.1.0
 * @link https://github.com/hakatashi/japanese.js
 * @license MIT
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process){
'use strict';

/* jslint browser: true */

(function () {
  var global;

  if (process.browser) {
    global = window;
  }

  global.japanese = require('./');
}).call(undefined);

}).call(this,require('_process'))

},{"./":2,"_process":9}],2:[function(require,module,exports){
'use strict';

var japanese = {};

require('./src/kana')(japanese);
require('./src/romanize')(japanese);
require('./src/numbers')(japanese);

module.exports = japanese;

},{"./src/kana":10,"./src/numbers":11,"./src/romanize":12}],3:[function(require,module,exports){
'use strict'

exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

function init () {
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }

  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63
}

init()

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],4:[function(require,module,exports){
/* big.js v3.1.3 https://github.com/MikeMcl/big.js/LICENCE */
;(function (global) {
    'use strict';

/*
  big.js v3.1.3
  A small, fast, easy-to-use library for arbitrary-precision decimal arithmetic.
  https://github.com/MikeMcl/big.js/
  Copyright (c) 2014 Michael Mclaughlin <M8ch88l@gmail.com>
  MIT Expat Licence
*/

/***************************** EDITABLE DEFAULTS ******************************/

    // The default values below must be integers within the stated ranges.

    /*
     * The maximum number of decimal places of the results of operations
     * involving division: div and sqrt, and pow with negative exponents.
     */
    var DP = 20,                           // 0 to MAX_DP

        /*
         * The rounding mode used when rounding to the above decimal places.
         *
         * 0 Towards zero (i.e. truncate, no rounding).       (ROUND_DOWN)
         * 1 To nearest neighbour. If equidistant, round up.  (ROUND_HALF_UP)
         * 2 To nearest neighbour. If equidistant, to even.   (ROUND_HALF_EVEN)
         * 3 Away from zero.                                  (ROUND_UP)
         */
        RM = 1,                            // 0, 1, 2 or 3

        // The maximum value of DP and Big.DP.
        MAX_DP = 1E6,                      // 0 to 1000000

        // The maximum magnitude of the exponent argument to the pow method.
        MAX_POWER = 1E6,                   // 1 to 1000000

        /*
         * The exponent value at and beneath which toString returns exponential
         * notation.
         * JavaScript's Number type: -7
         * -1000000 is the minimum recommended exponent value of a Big.
         */
        E_NEG = -7,                   // 0 to -1000000

        /*
         * The exponent value at and above which toString returns exponential
         * notation.
         * JavaScript's Number type: 21
         * 1000000 is the maximum recommended exponent value of a Big.
         * (This limit is not enforced or checked.)
         */
        E_POS = 21,                   // 0 to 1000000

/******************************************************************************/

        // The shared prototype object.
        P = {},
        isValid = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
        Big;


    /*
     * Create and return a Big constructor.
     *
     */
    function bigFactory() {

        /*
         * The Big constructor and exported function.
         * Create and return a new instance of a Big number object.
         *
         * n {number|string|Big} A numeric value.
         */
        function Big(n) {
            var x = this;

            // Enable constructor usage without new.
            if (!(x instanceof Big)) {
                return n === void 0 ? bigFactory() : new Big(n);
            }

            // Duplicate.
            if (n instanceof Big) {
                x.s = n.s;
                x.e = n.e;
                x.c = n.c.slice();
            } else {
                parse(x, n);
            }

            /*
             * Retain a reference to this Big constructor, and shadow
             * Big.prototype.constructor which points to Object.
             */
            x.constructor = Big;
        }

        Big.prototype = P;
        Big.DP = DP;
        Big.RM = RM;
        Big.E_NEG = E_NEG;
        Big.E_POS = E_POS;

        return Big;
    }


    // Private functions


    /*
     * Return a string representing the value of Big x in normal or exponential
     * notation to dp fixed decimal places or significant digits.
     *
     * x {Big} The Big to format.
     * dp {number} Integer, 0 to MAX_DP inclusive.
     * toE {number} 1 (toExponential), 2 (toPrecision) or undefined (toFixed).
     */
    function format(x, dp, toE) {
        var Big = x.constructor,

            // The index (normal notation) of the digit that may be rounded up.
            i = dp - (x = new Big(x)).e,
            c = x.c;

        // Round?
        if (c.length > ++dp) {
            rnd(x, i, Big.RM);
        }

        if (!c[0]) {
            ++i;
        } else if (toE) {
            i = dp;

        // toFixed
        } else {
            c = x.c;

            // Recalculate i as x.e may have changed if value rounded up.
            i = x.e + i + 1;
        }

        // Append zeros?
        for (; c.length < i; c.push(0)) {
        }
        i = x.e;

        /*
         * toPrecision returns exponential notation if the number of
         * significant digits specified is less than the number of digits
         * necessary to represent the integer part of the value in normal
         * notation.
         */
        return toE === 1 || toE && (dp <= i || i <= Big.E_NEG) ?

          // Exponential notation.
          (x.s < 0 && c[0] ? '-' : '') +
            (c.length > 1 ? c[0] + '.' + c.join('').slice(1) : c[0]) +
              (i < 0 ? 'e' : 'e+') + i

          // Normal notation.
          : x.toString();
    }


    /*
     * Parse the number or string value passed to a Big constructor.
     *
     * x {Big} A Big number instance.
     * n {number|string} A numeric value.
     */
    function parse(x, n) {
        var e, i, nL;

        // Minus zero?
        if (n === 0 && 1 / n < 0) {
            n = '-0';

        // Ensure n is string and check validity.
        } else if (!isValid.test(n += '')) {
            throwErr(NaN);
        }

        // Determine sign.
        x.s = n.charAt(0) == '-' ? (n = n.slice(1), -1) : 1;

        // Decimal point?
        if ((e = n.indexOf('.')) > -1) {
            n = n.replace('.', '');
        }

        // Exponential form?
        if ((i = n.search(/e/i)) > 0) {

            // Determine exponent.
            if (e < 0) {
                e = i;
            }
            e += +n.slice(i + 1);
            n = n.substring(0, i);

        } else if (e < 0) {

            // Integer.
            e = n.length;
        }

        // Determine leading zeros.
        for (i = 0; n.charAt(i) == '0'; i++) {
        }

        if (i == (nL = n.length)) {

            // Zero.
            x.c = [ x.e = 0 ];
        } else {

            // Determine trailing zeros.
            for (; n.charAt(--nL) == '0';) {
            }

            x.e = e - i - 1;
            x.c = [];

            // Convert string to array of digits without leading/trailing zeros.
            for (e = 0; i <= nL; x.c[e++] = +n.charAt(i++)) {
            }
        }

        return x;
    }


    /*
     * Round Big x to a maximum of dp decimal places using rounding mode rm.
     * Called by div, sqrt and round.
     *
     * x {Big} The Big to round.
     * dp {number} Integer, 0 to MAX_DP inclusive.
     * rm {number} 0, 1, 2 or 3 (DOWN, HALF_UP, HALF_EVEN, UP)
     * [more] {boolean} Whether the result of division was truncated.
     */
    function rnd(x, dp, rm, more) {
        var u,
            xc = x.c,
            i = x.e + dp + 1;

        if (rm === 1) {

            // xc[i] is the digit after the digit that may be rounded up.
            more = xc[i] >= 5;
        } else if (rm === 2) {
            more = xc[i] > 5 || xc[i] == 5 &&
              (more || i < 0 || xc[i + 1] !== u || xc[i - 1] & 1);
        } else if (rm === 3) {
            more = more || xc[i] !== u || i < 0;
        } else {
            more = false;

            if (rm !== 0) {
                throwErr('!Big.RM!');
            }
        }

        if (i < 1 || !xc[0]) {

            if (more) {

                // 1, 0.1, 0.01, 0.001, 0.0001 etc.
                x.e = -dp;
                x.c = [1];
            } else {

                // Zero.
                x.c = [x.e = 0];
            }
        } else {

            // Remove any digits after the required decimal places.
            xc.length = i--;

            // Round up?
            if (more) {

                // Rounding up may mean the previous digit has to be rounded up.
                for (; ++xc[i] > 9;) {
                    xc[i] = 0;

                    if (!i--) {
                        ++x.e;
                        xc.unshift(1);
                    }
                }
            }

            // Remove trailing zeros.
            for (i = xc.length; !xc[--i]; xc.pop()) {
            }
        }

        return x;
    }


    /*
     * Throw a BigError.
     *
     * message {string} The error message.
     */
    function throwErr(message) {
        var err = new Error(message);
        err.name = 'BigError';

        throw err;
    }


    // Prototype/instance methods


    /*
     * Return a new Big whose value is the absolute value of this Big.
     */
    P.abs = function () {
        var x = new this.constructor(this);
        x.s = 1;

        return x;
    };


    /*
     * Return
     * 1 if the value of this Big is greater than the value of Big y,
     * -1 if the value of this Big is less than the value of Big y, or
     * 0 if they have the same value.
    */
    P.cmp = function (y) {
        var xNeg,
            x = this,
            xc = x.c,
            yc = (y = new x.constructor(y)).c,
            i = x.s,
            j = y.s,
            k = x.e,
            l = y.e;

        // Either zero?
        if (!xc[0] || !yc[0]) {
            return !xc[0] ? !yc[0] ? 0 : -j : i;
        }

        // Signs differ?
        if (i != j) {
            return i;
        }
        xNeg = i < 0;

        // Compare exponents.
        if (k != l) {
            return k > l ^ xNeg ? 1 : -1;
        }

        i = -1;
        j = (k = xc.length) < (l = yc.length) ? k : l;

        // Compare digit by digit.
        for (; ++i < j;) {

            if (xc[i] != yc[i]) {
                return xc[i] > yc[i] ^ xNeg ? 1 : -1;
            }
        }

        // Compare lengths.
        return k == l ? 0 : k > l ^ xNeg ? 1 : -1;
    };


    /*
     * Return a new Big whose value is the value of this Big divided by the
     * value of Big y, rounded, if necessary, to a maximum of Big.DP decimal
     * places using rounding mode Big.RM.
     */
    P.div = function (y) {
        var x = this,
            Big = x.constructor,
            // dividend
            dvd = x.c,
            //divisor
            dvs = (y = new Big(y)).c,
            s = x.s == y.s ? 1 : -1,
            dp = Big.DP;

        if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
            throwErr('!Big.DP!');
        }

        // Either 0?
        if (!dvd[0] || !dvs[0]) {

            // If both are 0, throw NaN
            if (dvd[0] == dvs[0]) {
                throwErr(NaN);
            }

            // If dvs is 0, throw +-Infinity.
            if (!dvs[0]) {
                throwErr(s / 0);
            }

            // dvd is 0, return +-0.
            return new Big(s * 0);
        }

        var dvsL, dvsT, next, cmp, remI, u,
            dvsZ = dvs.slice(),
            dvdI = dvsL = dvs.length,
            dvdL = dvd.length,
            // remainder
            rem = dvd.slice(0, dvsL),
            remL = rem.length,
            // quotient
            q = y,
            qc = q.c = [],
            qi = 0,
            digits = dp + (q.e = x.e - y.e) + 1;

        q.s = s;
        s = digits < 0 ? 0 : digits;

        // Create version of divisor with leading zero.
        dvsZ.unshift(0);

        // Add zeros to make remainder as long as divisor.
        for (; remL++ < dvsL; rem.push(0)) {
        }

        do {

            // 'next' is how many times the divisor goes into current remainder.
            for (next = 0; next < 10; next++) {

                // Compare divisor and remainder.
                if (dvsL != (remL = rem.length)) {
                    cmp = dvsL > remL ? 1 : -1;
                } else {

                    for (remI = -1, cmp = 0; ++remI < dvsL;) {

                        if (dvs[remI] != rem[remI]) {
                            cmp = dvs[remI] > rem[remI] ? 1 : -1;
                            break;
                        }
                    }
                }

                // If divisor < remainder, subtract divisor from remainder.
                if (cmp < 0) {

                    // Remainder can't be more than 1 digit longer than divisor.
                    // Equalise lengths using divisor with extra leading zero?
                    for (dvsT = remL == dvsL ? dvs : dvsZ; remL;) {

                        if (rem[--remL] < dvsT[remL]) {
                            remI = remL;

                            for (; remI && !rem[--remI]; rem[remI] = 9) {
                            }
                            --rem[remI];
                            rem[remL] += 10;
                        }
                        rem[remL] -= dvsT[remL];
                    }
                    for (; !rem[0]; rem.shift()) {
                    }
                } else {
                    break;
                }
            }

            // Add the 'next' digit to the result array.
            qc[qi++] = cmp ? next : ++next;

            // Update the remainder.
            if (rem[0] && cmp) {
                rem[remL] = dvd[dvdI] || 0;
            } else {
                rem = [ dvd[dvdI] ];
            }

        } while ((dvdI++ < dvdL || rem[0] !== u) && s--);

        // Leading zero? Do not remove if result is simply zero (qi == 1).
        if (!qc[0] && qi != 1) {

            // There can't be more than one zero.
            qc.shift();
            q.e--;
        }

        // Round?
        if (qi > digits) {
            rnd(q, dp, Big.RM, rem[0] !== u);
        }

        return q;
    };


    /*
     * Return true if the value of this Big is equal to the value of Big y,
     * otherwise returns false.
     */
    P.eq = function (y) {
        return !this.cmp(y);
    };


    /*
     * Return true if the value of this Big is greater than the value of Big y,
     * otherwise returns false.
     */
    P.gt = function (y) {
        return this.cmp(y) > 0;
    };


    /*
     * Return true if the value of this Big is greater than or equal to the
     * value of Big y, otherwise returns false.
     */
    P.gte = function (y) {
        return this.cmp(y) > -1;
    };


    /*
     * Return true if the value of this Big is less than the value of Big y,
     * otherwise returns false.
     */
    P.lt = function (y) {
        return this.cmp(y) < 0;
    };


    /*
     * Return true if the value of this Big is less than or equal to the value
     * of Big y, otherwise returns false.
     */
    P.lte = function (y) {
         return this.cmp(y) < 1;
    };


    /*
     * Return a new Big whose value is the value of this Big minus the value
     * of Big y.
     */
    P.sub = P.minus = function (y) {
        var i, j, t, xLTy,
            x = this,
            Big = x.constructor,
            a = x.s,
            b = (y = new Big(y)).s;

        // Signs differ?
        if (a != b) {
            y.s = -b;
            return x.plus(y);
        }

        var xc = x.c.slice(),
            xe = x.e,
            yc = y.c,
            ye = y.e;

        // Either zero?
        if (!xc[0] || !yc[0]) {

            // y is non-zero? x is non-zero? Or both are zero.
            return yc[0] ? (y.s = -b, y) : new Big(xc[0] ? x : 0);
        }

        // Determine which is the bigger number.
        // Prepend zeros to equalise exponents.
        if (a = xe - ye) {

            if (xLTy = a < 0) {
                a = -a;
                t = xc;
            } else {
                ye = xe;
                t = yc;
            }

            t.reverse();
            for (b = a; b--; t.push(0)) {
            }
            t.reverse();
        } else {

            // Exponents equal. Check digit by digit.
            j = ((xLTy = xc.length < yc.length) ? xc : yc).length;

            for (a = b = 0; b < j; b++) {

                if (xc[b] != yc[b]) {
                    xLTy = xc[b] < yc[b];
                    break;
                }
            }
        }

        // x < y? Point xc to the array of the bigger number.
        if (xLTy) {
            t = xc;
            xc = yc;
            yc = t;
            y.s = -y.s;
        }

        /*
         * Append zeros to xc if shorter. No need to add zeros to yc if shorter
         * as subtraction only needs to start at yc.length.
         */
        if (( b = (j = yc.length) - (i = xc.length) ) > 0) {

            for (; b--; xc[i++] = 0) {
            }
        }

        // Subtract yc from xc.
        for (b = i; j > a;){

            if (xc[--j] < yc[j]) {

                for (i = j; i && !xc[--i]; xc[i] = 9) {
                }
                --xc[i];
                xc[j] += 10;
            }
            xc[j] -= yc[j];
        }

        // Remove trailing zeros.
        for (; xc[--b] === 0; xc.pop()) {
        }

        // Remove leading zeros and adjust exponent accordingly.
        for (; xc[0] === 0;) {
            xc.shift();
            --ye;
        }

        if (!xc[0]) {

            // n - n = +0
            y.s = 1;

            // Result must be zero.
            xc = [ye = 0];
        }

        y.c = xc;
        y.e = ye;

        return y;
    };


    /*
     * Return a new Big whose value is the value of this Big modulo the
     * value of Big y.
     */
    P.mod = function (y) {
        var yGTx,
            x = this,
            Big = x.constructor,
            a = x.s,
            b = (y = new Big(y)).s;

        if (!y.c[0]) {
            throwErr(NaN);
        }

        x.s = y.s = 1;
        yGTx = y.cmp(x) == 1;
        x.s = a;
        y.s = b;

        if (yGTx) {
            return new Big(x);
        }

        a = Big.DP;
        b = Big.RM;
        Big.DP = Big.RM = 0;
        x = x.div(y);
        Big.DP = a;
        Big.RM = b;

        return this.minus( x.times(y) );
    };


    /*
     * Return a new Big whose value is the value of this Big plus the value
     * of Big y.
     */
    P.add = P.plus = function (y) {
        var t,
            x = this,
            Big = x.constructor,
            a = x.s,
            b = (y = new Big(y)).s;

        // Signs differ?
        if (a != b) {
            y.s = -b;
            return x.minus(y);
        }

        var xe = x.e,
            xc = x.c,
            ye = y.e,
            yc = y.c;

        // Either zero?
        if (!xc[0] || !yc[0]) {

            // y is non-zero? x is non-zero? Or both are zero.
            return yc[0] ? y : new Big(xc[0] ? x : a * 0);
        }
        xc = xc.slice();

        // Prepend zeros to equalise exponents.
        // Note: Faster to use reverse then do unshifts.
        if (a = xe - ye) {

            if (a > 0) {
                ye = xe;
                t = yc;
            } else {
                a = -a;
                t = xc;
            }

            t.reverse();
            for (; a--; t.push(0)) {
            }
            t.reverse();
        }

        // Point xc to the longer array.
        if (xc.length - yc.length < 0) {
            t = yc;
            yc = xc;
            xc = t;
        }
        a = yc.length;

        /*
         * Only start adding at yc.length - 1 as the further digits of xc can be
         * left as they are.
         */
        for (b = 0; a;) {
            b = (xc[--a] = xc[a] + yc[a] + b) / 10 | 0;
            xc[a] %= 10;
        }

        // No need to check for zero, as +x + +y != 0 && -x + -y != 0

        if (b) {
            xc.unshift(b);
            ++ye;
        }

         // Remove trailing zeros.
        for (a = xc.length; xc[--a] === 0; xc.pop()) {
        }

        y.c = xc;
        y.e = ye;

        return y;
    };


    /*
     * Return a Big whose value is the value of this Big raised to the power n.
     * If n is negative, round, if necessary, to a maximum of Big.DP decimal
     * places using rounding mode Big.RM.
     *
     * n {number} Integer, -MAX_POWER to MAX_POWER inclusive.
     */
    P.pow = function (n) {
        var x = this,
            one = new x.constructor(1),
            y = one,
            isNeg = n < 0;

        if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) {
            throwErr('!pow!');
        }

        n = isNeg ? -n : n;

        for (;;) {

            if (n & 1) {
                y = y.times(x);
            }
            n >>= 1;

            if (!n) {
                break;
            }
            x = x.times(x);
        }

        return isNeg ? one.div(y) : y;
    };


    /*
     * Return a new Big whose value is the value of this Big rounded to a
     * maximum of dp decimal places using rounding mode rm.
     * If dp is not specified, round to 0 decimal places.
     * If rm is not specified, use Big.RM.
     *
     * [dp] {number} Integer, 0 to MAX_DP inclusive.
     * [rm] 0, 1, 2 or 3 (ROUND_DOWN, ROUND_HALF_UP, ROUND_HALF_EVEN, ROUND_UP)
     */
    P.round = function (dp, rm) {
        var x = this,
            Big = x.constructor;

        if (dp == null) {
            dp = 0;
        } else if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
            throwErr('!round!');
        }
        rnd(x = new Big(x), dp, rm == null ? Big.RM : rm);

        return x;
    };


    /*
     * Return a new Big whose value is the square root of the value of this Big,
     * rounded, if necessary, to a maximum of Big.DP decimal places using
     * rounding mode Big.RM.
     */
    P.sqrt = function () {
        var estimate, r, approx,
            x = this,
            Big = x.constructor,
            xc = x.c,
            i = x.s,
            e = x.e,
            half = new Big('0.5');

        // Zero?
        if (!xc[0]) {
            return new Big(x);
        }

        // If negative, throw NaN.
        if (i < 0) {
            throwErr(NaN);
        }

        // Estimate.
        i = Math.sqrt(x.toString());

        // Math.sqrt underflow/overflow?
        // Pass x to Math.sqrt as integer, then adjust the result exponent.
        if (i === 0 || i === 1 / 0) {
            estimate = xc.join('');

            if (!(estimate.length + e & 1)) {
                estimate += '0';
            }

            r = new Big( Math.sqrt(estimate).toString() );
            r.e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
        } else {
            r = new Big(i.toString());
        }

        i = r.e + (Big.DP += 4);

        // Newton-Raphson iteration.
        do {
            approx = r;
            r = half.times( approx.plus( x.div(approx) ) );
        } while ( approx.c.slice(0, i).join('') !==
                       r.c.slice(0, i).join('') );

        rnd(r, Big.DP -= 4, Big.RM);

        return r;
    };


    /*
     * Return a new Big whose value is the value of this Big times the value of
     * Big y.
     */
    P.mul = P.times = function (y) {
        var c,
            x = this,
            Big = x.constructor,
            xc = x.c,
            yc = (y = new Big(y)).c,
            a = xc.length,
            b = yc.length,
            i = x.e,
            j = y.e;

        // Determine sign of result.
        y.s = x.s == y.s ? 1 : -1;

        // Return signed 0 if either 0.
        if (!xc[0] || !yc[0]) {
            return new Big(y.s * 0);
        }

        // Initialise exponent of result as x.e + y.e.
        y.e = i + j;

        // If array xc has fewer digits than yc, swap xc and yc, and lengths.
        if (a < b) {
            c = xc;
            xc = yc;
            yc = c;
            j = a;
            a = b;
            b = j;
        }

        // Initialise coefficient array of result with zeros.
        for (c = new Array(j = a + b); j--; c[j] = 0) {
        }

        // Multiply.

        // i is initially xc.length.
        for (i = b; i--;) {
            b = 0;

            // a is yc.length.
            for (j = a + i; j > i;) {

                // Current sum of products at this digit position, plus carry.
                b = c[j] + yc[i] * xc[j - i - 1] + b;
                c[j--] = b % 10;

                // carry
                b = b / 10 | 0;
            }
            c[j] = (c[j] + b) % 10;
        }

        // Increment result exponent if there is a final carry.
        if (b) {
            ++y.e;
        }

        // Remove any leading zero.
        if (!c[0]) {
            c.shift();
        }

        // Remove trailing zeros.
        for (i = c.length; !c[--i]; c.pop()) {
        }
        y.c = c;

        return y;
    };


    /*
     * Return a string representing the value of this Big.
     * Return exponential notation if this Big has a positive exponent equal to
     * or greater than Big.E_POS, or a negative exponent equal to or less than
     * Big.E_NEG.
     */
    P.toString = P.valueOf = P.toJSON = function () {
        var x = this,
            Big = x.constructor,
            e = x.e,
            str = x.c.join(''),
            strL = str.length;

        // Exponential notation?
        if (e <= Big.E_NEG || e >= Big.E_POS) {
            str = str.charAt(0) + (strL > 1 ? '.' + str.slice(1) : '') +
              (e < 0 ? 'e' : 'e+') + e;

        // Negative exponent?
        } else if (e < 0) {

            // Prepend zeros.
            for (; ++e; str = '0' + str) {
            }
            str = '0.' + str;

        // Positive exponent?
        } else if (e > 0) {

            if (++e > strL) {

                // Append zeros.
                for (e -= strL; e-- ; str += '0') {
                }
            } else if (e < strL) {
                str = str.slice(0, e) + '.' + str.slice(e);
            }

        // Exponent zero.
        } else if (strL > 1) {
            str = str.charAt(0) + '.' + str.slice(1);
        }

        // Avoid '-0'
        return x.s < 0 && x.c[0] ? '-' + str : str;
    };


    /*
     ***************************************************************************
     * If toExponential, toFixed, toPrecision and format are not required they
     * can safely be commented-out or deleted. No redundant code will be left.
     * format is used only by toExponential, toFixed and toPrecision.
     ***************************************************************************
     */


    /*
     * Return a string representing the value of this Big in exponential
     * notation to dp fixed decimal places and rounded, if necessary, using
     * Big.RM.
     *
     * [dp] {number} Integer, 0 to MAX_DP inclusive.
     */
    P.toExponential = function (dp) {

        if (dp == null) {
            dp = this.c.length - 1;
        } else if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
            throwErr('!toExp!');
        }

        return format(this, dp, 1);
    };


    /*
     * Return a string representing the value of this Big in normal notation
     * to dp fixed decimal places and rounded, if necessary, using Big.RM.
     *
     * [dp] {number} Integer, 0 to MAX_DP inclusive.
     */
    P.toFixed = function (dp) {
        var str,
            x = this,
            Big = x.constructor,
            neg = Big.E_NEG,
            pos = Big.E_POS;

        // Prevent the possibility of exponential notation.
        Big.E_NEG = -(Big.E_POS = 1 / 0);

        if (dp == null) {
            str = x.toString();
        } else if (dp === ~~dp && dp >= 0 && dp <= MAX_DP) {
            str = format(x, x.e + dp);

            // (-0).toFixed() is '0', but (-0.1).toFixed() is '-0'.
            // (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
            if (x.s < 0 && x.c[0] && str.indexOf('-') < 0) {
        //E.g. -0.5 if rounded to -0 will cause toString to omit the minus sign.
                str = '-' + str;
            }
        }
        Big.E_NEG = neg;
        Big.E_POS = pos;

        if (!str) {
            throwErr('!toFix!');
        }

        return str;
    };


    /*
     * Return a string representing the value of this Big rounded to sd
     * significant digits using Big.RM. Use exponential notation if sd is less
     * than the number of digits necessary to represent the integer part of the
     * value in normal notation.
     *
     * sd {number} Integer, 1 to MAX_DP inclusive.
     */
    P.toPrecision = function (sd) {

        if (sd == null) {
            return this.toString();
        } else if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
            throwErr('!toPre!');
        }

        return format(this, sd - 1, 2);
    };


    // Export


    Big = bigFactory();

    //AMD.
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return Big;
        });

    // Node and other CommonJS-like environments that support module.exports.
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = Big;

    //Browser.
    } else {
        global.Big = Big;
    }
})(this);

},{}],5:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; i++) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  that.write(string, encoding)
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

function arrayIndexOf (arr, val, byteOffset, encoding) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var foundIndex = -1
  for (var i = 0; byteOffset + i < arrLength; i++) {
    if (read(arr, byteOffset + i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
      if (foundIndex === -1) foundIndex = i
      if (i - foundIndex + 1 === valLength) return (byteOffset + foundIndex) * indexSize
    } else {
      if (foundIndex !== -1) i -= i - foundIndex
      foundIndex = -1
    }
  }
  return -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  if (Buffer.isBuffer(val)) {
    // special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(this, val, byteOffset, encoding)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset, encoding)
  }

  throw new TypeError('val must be string, number or Buffer')
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; i++) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; i++) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"base64-js":3,"ieee754":7,"isarray":8}],6:[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
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
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],7:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],8:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],9:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],10:[function(require,module,exports){
'use strict';

module.exports = function (japanese) {
	japanese.katakanaRegex = new RegExp('(' + '[' + '\\u30a1-\\u30f4' + // ァ～ヴ
	'\\u30f7-\\u30fa' + // ヷ～ヺ
	'\\u30fd-\\u30ff' + // ヽ～ヿ
	'\\u31f0-\\u31ff' + // ㇰ～ㇿ
	']' + '|' + '\\ud869\\udf08\\u3099' + // 𪜈゙
	'|' + '\\ud869\\udf08' + // 𪜈
	'|' + '\\ud82c\\udc00' + // 𛀀
	')', 'g');

	japanese.hiraganaRegex = new RegExp('(' + '[' + '\\u3041-\\u3094' + // ぁ～ゔ
	'\\u309d-\\u309f' + // ゝ～ゟ
	']' + '|' + '\\ud82c\\udc01' + // 𛀁
	')', 'g');

	japanese.specialHiraganizationTable = {
		'ヿ': 'こと',
		'𪜈': 'とも',
		'𪜈゙': 'ども',
		'ヷ': 'わ゙',
		'ヸ': 'ゐ゙',
		'ヹ': 'ゑ゙',
		'ヺ': 'を゙',
		'𛀀': 'え',
		'ㇰ': 'く',
		'ㇱ': 'し',
		'ㇲ': 'す',
		'ㇳ': 'と',
		'ㇴ': 'ぬ',
		'ㇵ': 'は',
		'ㇶ': 'ひ',
		'ㇷ': 'ふ',
		'ㇸ': 'へ',
		'ㇹ': 'ほ',
		'ㇺ': 'む',
		'ㇻ': 'ら',
		'ㇼ': 'り',
		'ㇽ': 'る',
		'ㇾ': 'れ',
		'ㇿ': 'ろ'
	};

	japanese.specialKatakanizationTable = {
		'ゟ': 'ヨリ',
		'𛀁': 'エ'
	};

	var chr = String.fromCharCode;
	var ord = function ord(char) {
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
};

},{}],11:[function(require,module,exports){
(function (Buffer){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var extend = require('extend');
var Big = require('big.js');

// Get nth bit from buffer
function getBit(buffer, position) {
	var byteIndex = Math.floor(position / 8);
	var byte = buffer[byteIndex] || 0;

	return !!(byte & 1 << 7 - position % 8);
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

// Compatify Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER
var MAX_SAFE_INTEGER = 9007199254740991;
var MIN_SAFE_INTEGER = -9007199254740991;

module.exports = function (japanese) {
	japanese.transcriptionConfigs = {
		'default': {
			minusSign: 'マイナス',
			decimalPoint: '・',
			digits: 'common',
			unitNames: 'jinkoki3',
			specialUnitNames: 'none',
			truncateOne: ['十', '百', '千', '拾', '佰', '阡', '仟'],
			smallUnitNames: 'none'
		},
		formal: {
			digits: 'formal',
			unitNames: 'formal',
			specialUnitNames: 'common',
			smallUnitNames: 'common'
		},
		traditional: {
			digits: 'traditional',
			specialUnitNames: 'full',
			smallUnitNames: 'full'
		}
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
				9: '9'
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
				9: '九'
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
				9: '九'
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
				9: '玖'
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
				9: '玖'
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
				9: '玖'
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
				9: '勾'
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
				9: '𠃩'
			}
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
				lit: 63
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
				lit: 96
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
				lit: 72
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
				lit: 524288
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
				lit: 72
			}
		},
		specialUnitNames: {
			none: {},
			common: {
				20: '廿',
				30: '卅'
			},
			full: {
				20: '廿',
				30: '卅',
				40: '卌',
				200: '皕'
			}
		},
		smallUnitNames: {
			none: {},
			common: {
				1: '分',
				2: '厘',
				3: '毛',
				4: '糸'
			},
			wari: {
				1: '割',
				2: '分',
				3: '厘',
				4: '毛',
				5: '糸'
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
				21: '清浄'
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
				22: '清浄'
			}
		}
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

		if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object') {
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
			if (MIN_SAFE_INTEGER <= number && number < MAX_SAFE_INTEGER) {
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
					fraction = new Big(2).pow(52).plus(mantissa);
				}

				number = fraction.times(new Big(2).pow(exponent - 1023 - 52)).toFixed();

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
				if (!token.split('').every(function (digit) {
					return digit === '0';
				})) {
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

}).call(this,require("buffer").Buffer)

},{"big.js":4,"buffer":5,"extend":6}],12:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var extend = require('extend');

module.exports = function (japanese) {
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
		'ヶ': 'ke'
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
		' ': ' '
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
		punctuation: true
	};

	japanese.romanizationConfigs = {
		wikipedia: {},
		'traditional hepburn': {
			'を': 'wo',
			'んあ': 'n-a',
			'んば': 'mba'
		},
		'modified hepburn': {
			'ああ': 'ā',
			'いい': 'ii',
			'うう': 'ū',
			'ええ': 'ē',
			'おお': 'ō'
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
			'っち': 'tti'
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
			'を': 'wo'
		}
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

		if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object') {
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
				'しょ': 'sho'
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
				'てゅ': 'tyu'
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
				'とぅ': 'tu'
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
				'ふょ': 'fyo'
			});
		}

		if (config['じ'] === 'ji') {
			extend(table, {
				'じ': 'ji',
				'じゃ': 'ja',
				'じゅ': 'ju',
				'じぇ': 'je',
				'じょ': 'jo'
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
				'でゅ': 'dyu'
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
				'でゅ': 'dyu'
			});
		}

		if (config['ぢ'] === 'dji') {
			extend(table, {
				'ぢ': 'dji',
				'ぢゃ': 'dja',
				'ぢゅ': 'dju',
				'ぢぇ': 'dje',
				'ぢょ': 'djo',
				'でぃ': 'di',
				'でゅ': 'dyu'
			});
		}

		if (config['ぢ'] === 'dzi') {
			extend(table, {
				'ぢ': 'dzi',
				'ぢゃ': 'dzya',
				'ぢゅ': 'dzyu',
				'ぢぇ': 'dzye',
				'ぢょ': 'dzyo',
				'でぃ': 'di',
				'でゅ': 'dyu'
			});
		}

		if (config['づ'] === 'zu') {
			extend(table, {
				'づ': 'zu',
				'づぁ': 'zua',
				'づぃ': 'zui',
				'づぇ': 'zue',
				'づぉ': 'zuo',
				'どぅ': 'du'
			});
		}

		if (config['づ'] === 'dsu') {
			extend(table, {
				'づ': 'dsu',
				'づぁ': 'dsua',
				'づぃ': 'dsui',
				'づぇ': 'dsue',
				'づぉ': 'dsuo',
				'どぅ': 'du'
			});
		}

		if (config['づ'] === 'dzu') {
			extend(table, {
				'づ': 'dzu',
				'づぁ': 'dzua',
				'づぃ': 'dzui',
				'づぇ': 'dzue',
				'づぉ': 'dzuo',
				'どぅ': 'du'
			});
		}

		if (config['ゐ'] === 'i') {
			extend(table, {
				'ゐ': 'i',
				'ゑ': 'e'
			});
		}

		if (config['を'] === 'o') {
			extend(table, {
				'を': 'o'
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
								'ちょ': 'tcho'
							}[token];
						} else if (config['っち'] === 'cchi') {
							tokenDest = {
								'ち': 'cchi',
								'ちゃ': 'ccha',
								'ちゅ': 'cchu',
								'ちぇ': 'cche',
								'ちょ': 'ccho'
							}[token];
						} else {
							// normally 'tti'
							tokenDest = {
								'ち': 'tti',
								'ちゃ': 'ttya',
								'ちゅ': 'ttyu',
								'ちぇ': 'ttye',
								'ちょ': 'ttyo'
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
								'o': 'oo'
							}[dest.slice(-1)];
						} else if (config['あー'] === 'â') {
							dest = dest.slice(0, -1) + {
								'a': 'â',
								'i': 'î',
								'u': 'û',
								'e': 'ê',
								'o': 'ô'
							}[dest.slice(-1)];
						} else if (config['あー'] === 'ā') {
							dest = dest.slice(0, -1) + {
								'a': 'ā',
								'i': 'ī',
								'u': 'ū',
								'e': 'ē',
								'o': 'ō'
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
							'o': 'おお'
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
};

},{"extend":6}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLmpzIiwiaW5kZXguanMiLCJub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanMiLCJub2RlX21vZHVsZXMvYmlnLmpzL2JpZy5qcyIsIm5vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZXh0ZW5kL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaXNhcnJheS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJzcmNcXGthbmEuanMiLCJzcmNcXHNyY1xcbnVtYmVycy5qcyIsInNyY1xccm9tYW5pemUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0VBLENBQUMsWUFBVztBQUNWLE1BQUksTUFBSjs7QUFFQSxNQUFJLFFBQVEsT0FBWixFQUFxQjtBQUNuQixhQUFTLE1BQVQ7QUFDRDs7QUFFRCxTQUFPLFFBQVAsR0FBa0IsUUFBUSxJQUFSLENBQWxCO0FBRUQsQ0FURCxFQVNHLElBVEg7Ozs7O0FDRkE7O0FBRUEsSUFBSSxXQUFXLEVBQWY7O0FBRUEsUUFBUSxZQUFSLEVBQXNCLFFBQXRCO0FBQ0EsUUFBUSxnQkFBUixFQUEwQixRQUExQjtBQUNBLFFBQVEsZUFBUixFQUF5QixRQUF6Qjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsUUFBakI7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdG5DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDL3FEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsVUFBVSxRQUFWLEVBQW9CO0FBQ3BDLFVBQVMsYUFBVCxHQUF5QixJQUFJLE1BQUosQ0FBVyxNQUFN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QXJCLEVBQTRCOztBQUUzQixLQUZELE1BRU8sSUFBSSxPQUFPLElBQVAsTUFBaUIsS0FBckIsRUFBNEI7QUFDakMsYUFBTyxLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsQ0FBQyxDQUFmLElBQW9CLEdBQTNCO0FBQ0E7QUFDRjs7O0FBR0QsT0FBSSxVQUFVLEtBQVYsQ0FBZ0IsV0FBaEIsS0FBZ0Msa0JBQWtCLEdBQXRELEVBQTJEO0FBQzFELFFBQUksT0FBTyxJQUFQLE1BQWlCLElBQXJCLEVBQTJCOztBQUUxQixLQUZELE1BRU8sSUFBSSxPQUFPLElBQVAsTUFBaUIsTUFBckIsRUFBNkI7QUFDbEMsa0JBQVksT0FBTyxTQUFuQjtBQUNBLE1BRkssTUFFQyxJQUFJLE9BQU8sSUFBUCxNQUFpQixLQUFyQixFQUE0QjtBQUNsQyxrQkFBWSxNQUFNLFNBQWxCO0FBQ0E7QUFDRjs7QUFFRCxPQUFJLE9BQU8sV0FBUCxJQUFzQixTQUFTLHlCQUFULENBQW1DLEtBQW5DLENBQTFCLEVBQXFFO0FBQ3BFLGdCQUFZLFNBQVMseUJBQVQsQ0FBbUMsS0FBbkMsQ0FBWjtBQUNBOztBQUVELFdBQVEsU0FBUjs7QUFFQSxtQkFBZ0IsS0FBaEI7QUFDQTs7QUFFRCxNQUFJLGtCQUFrQixHQUF0QixFQUEyQjtBQUMxQixXQUFRLElBQVI7QUFDQTs7QUFFRCxTQUFPLElBQVA7QUFDQSxFQXJXRDtBQXNXQSxDQXBwQkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoganNsaW50IGJyb3dzZXI6IHRydWUgKi9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICB2YXIgZ2xvYmFsO1xyXG5cclxuICBpZiAocHJvY2Vzcy5icm93c2VyKSB7XHJcbiAgICBnbG9iYWwgPSB3aW5kb3c7XHJcbiAgfVxyXG5cclxuICBnbG9iYWwuamFwYW5lc2UgPSByZXF1aXJlKCcuLycpO1xyXG5cclxufSkuY2FsbCh0aGlzKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGphcGFuZXNlID0ge307XHJcblxyXG5yZXF1aXJlKCcuL3NyYy9rYW5hJykoamFwYW5lc2UpO1xyXG5yZXF1aXJlKCcuL3NyYy9yb21hbml6ZScpKGphcGFuZXNlKTtcclxucmVxdWlyZSgnLi9zcmMvbnVtYmVycycpKGphcGFuZXNlKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gamFwYW5lc2U7XHJcbiIsIid1c2Ugc3RyaWN0J1xuXG5leHBvcnRzLnRvQnl0ZUFycmF5ID0gdG9CeXRlQXJyYXlcbmV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IGZyb21CeXRlQXJyYXlcblxudmFyIGxvb2t1cCA9IFtdXG52YXIgcmV2TG9va3VwID0gW11cbnZhciBBcnIgPSB0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcgPyBVaW50OEFycmF5IDogQXJyYXlcblxuZnVuY3Rpb24gaW5pdCAoKSB7XG4gIHZhciBjb2RlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb2RlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgbG9va3VwW2ldID0gY29kZVtpXVxuICAgIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaVxuICB9XG5cbiAgcmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG4gIHJldkxvb2t1cFsnXycuY2hhckNvZGVBdCgwKV0gPSA2M1xufVxuXG5pbml0KClcblxuZnVuY3Rpb24gdG9CeXRlQXJyYXkgKGI2NCkge1xuICB2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXG4gIGlmIChsZW4gJSA0ID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG4gIH1cblxuICAvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuICAvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG4gIC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuICAvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcbiAgLy8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuICBwbGFjZUhvbGRlcnMgPSBiNjRbbGVuIC0gMl0gPT09ICc9JyA/IDIgOiBiNjRbbGVuIC0gMV0gPT09ICc9JyA/IDEgOiAwXG5cbiAgLy8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG4gIGFyciA9IG5ldyBBcnIobGVuICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cbiAgLy8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuICBsID0gcGxhY2VIb2xkZXJzID4gMCA/IGxlbiAtIDQgOiBsZW5cblxuICB2YXIgTCA9IDBcblxuICBmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTgpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDEyKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA8PCA2KSB8IHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMyldXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDE2KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxMCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgNCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG4gIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDYgJiAweDNGXSArIGxvb2t1cFtudW0gJiAweDNGXVxufVxuXG5mdW5jdGlvbiBlbmNvZGVDaHVuayAodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHRtcFxuICB2YXIgb3V0cHV0ID0gW11cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IDMpIHtcbiAgICB0bXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG4gICAgb3V0cHV0LnB1c2godHJpcGxldFRvQmFzZTY0KHRtcCkpXG4gIH1cbiAgcmV0dXJuIG91dHB1dC5qb2luKCcnKVxufVxuXG5mdW5jdGlvbiBmcm9tQnl0ZUFycmF5ICh1aW50OCkge1xuICB2YXIgdG1wXG4gIHZhciBsZW4gPSB1aW50OC5sZW5ndGhcbiAgdmFyIGV4dHJhQnl0ZXMgPSBsZW4gJSAzIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG4gIHZhciBvdXRwdXQgPSAnJ1xuICB2YXIgcGFydHMgPSBbXVxuICB2YXIgbWF4Q2h1bmtMZW5ndGggPSAxNjM4MyAvLyBtdXN0IGJlIG11bHRpcGxlIG9mIDNcblxuICAvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG4gIGZvciAodmFyIGkgPSAwLCBsZW4yID0gbGVuIC0gZXh0cmFCeXRlczsgaSA8IGxlbjI7IGkgKz0gbWF4Q2h1bmtMZW5ndGgpIHtcbiAgICBwYXJ0cy5wdXNoKGVuY29kZUNodW5rKHVpbnQ4LCBpLCAoaSArIG1heENodW5rTGVuZ3RoKSA+IGxlbjIgPyBsZW4yIDogKGkgKyBtYXhDaHVua0xlbmd0aCkpKVxuICB9XG5cbiAgLy8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuICBpZiAoZXh0cmFCeXRlcyA9PT0gMSkge1xuICAgIHRtcCA9IHVpbnQ4W2xlbiAtIDFdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFt0bXAgPj4gMl1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPDwgNCkgJiAweDNGXVxuICAgIG91dHB1dCArPSAnPT0nXG4gIH0gZWxzZSBpZiAoZXh0cmFCeXRlcyA9PT0gMikge1xuICAgIHRtcCA9ICh1aW50OFtsZW4gLSAyXSA8PCA4KSArICh1aW50OFtsZW4gLSAxXSlcbiAgICBvdXRwdXQgKz0gbG9va3VwW3RtcCA+PiAxMF1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPj4gNCkgJiAweDNGXVxuICAgIG91dHB1dCArPSBsb29rdXBbKHRtcCA8PCAyKSAmIDB4M0ZdXG4gICAgb3V0cHV0ICs9ICc9J1xuICB9XG5cbiAgcGFydHMucHVzaChvdXRwdXQpXG5cbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpXG59XG4iLCIvKiBiaWcuanMgdjMuMS4zIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWtlTWNsL2JpZy5qcy9MSUNFTkNFICovXHJcbjsoZnVuY3Rpb24gKGdsb2JhbCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuICBiaWcuanMgdjMuMS4zXHJcbiAgQSBzbWFsbCwgZmFzdCwgZWFzeS10by11c2UgbGlicmFyeSBmb3IgYXJiaXRyYXJ5LXByZWNpc2lvbiBkZWNpbWFsIGFyaXRobWV0aWMuXHJcbiAgaHR0cHM6Ly9naXRodWIuY29tL01pa2VNY2wvYmlnLmpzL1xyXG4gIENvcHlyaWdodCAoYykgMjAxNCBNaWNoYWVsIE1jbGF1Z2hsaW4gPE04Y2g4OGxAZ21haWwuY29tPlxyXG4gIE1JVCBFeHBhdCBMaWNlbmNlXHJcbiovXHJcblxyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogRURJVEFCTEUgREVGQVVMVFMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlcyBiZWxvdyBtdXN0IGJlIGludGVnZXJzIHdpdGhpbiB0aGUgc3RhdGVkIHJhbmdlcy5cclxuXHJcbiAgICAvKlxyXG4gICAgICogVGhlIG1heGltdW0gbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzIG9mIHRoZSByZXN1bHRzIG9mIG9wZXJhdGlvbnNcclxuICAgICAqIGludm9sdmluZyBkaXZpc2lvbjogZGl2IGFuZCBzcXJ0LCBhbmQgcG93IHdpdGggbmVnYXRpdmUgZXhwb25lbnRzLlxyXG4gICAgICovXHJcbiAgICB2YXIgRFAgPSAyMCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIE1BWF9EUFxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRoZSByb3VuZGluZyBtb2RlIHVzZWQgd2hlbiByb3VuZGluZyB0byB0aGUgYWJvdmUgZGVjaW1hbCBwbGFjZXMuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiAwIFRvd2FyZHMgemVybyAoaS5lLiB0cnVuY2F0ZSwgbm8gcm91bmRpbmcpLiAgICAgICAoUk9VTkRfRE9XTilcclxuICAgICAgICAgKiAxIFRvIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgcm91bmQgdXAuICAoUk9VTkRfSEFMRl9VUClcclxuICAgICAgICAgKiAyIFRvIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgdG8gZXZlbi4gICAoUk9VTkRfSEFMRl9FVkVOKVxyXG4gICAgICAgICAqIDMgQXdheSBmcm9tIHplcm8uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChST1VORF9VUClcclxuICAgICAgICAgKi9cclxuICAgICAgICBSTSA9IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAsIDEsIDIgb3IgM1xyXG5cclxuICAgICAgICAvLyBUaGUgbWF4aW11bSB2YWx1ZSBvZiBEUCBhbmQgQmlnLkRQLlxyXG4gICAgICAgIE1BWF9EUCA9IDFFNiwgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byAxMDAwMDAwXHJcblxyXG4gICAgICAgIC8vIFRoZSBtYXhpbXVtIG1hZ25pdHVkZSBvZiB0aGUgZXhwb25lbnQgYXJndW1lbnQgdG8gdGhlIHBvdyBtZXRob2QuXHJcbiAgICAgICAgTUFYX1BPV0VSID0gMUU2LCAgICAgICAgICAgICAgICAgICAvLyAxIHRvIDEwMDAwMDBcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUaGUgZXhwb25lbnQgdmFsdWUgYXQgYW5kIGJlbmVhdGggd2hpY2ggdG9TdHJpbmcgcmV0dXJucyBleHBvbmVudGlhbFxyXG4gICAgICAgICAqIG5vdGF0aW9uLlxyXG4gICAgICAgICAqIEphdmFTY3JpcHQncyBOdW1iZXIgdHlwZTogLTdcclxuICAgICAgICAgKiAtMTAwMDAwMCBpcyB0aGUgbWluaW11bSByZWNvbW1lbmRlZCBleHBvbmVudCB2YWx1ZSBvZiBhIEJpZy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBFX05FRyA9IC03LCAgICAgICAgICAgICAgICAgICAvLyAwIHRvIC0xMDAwMDAwXHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVGhlIGV4cG9uZW50IHZhbHVlIGF0IGFuZCBhYm92ZSB3aGljaCB0b1N0cmluZyByZXR1cm5zIGV4cG9uZW50aWFsXHJcbiAgICAgICAgICogbm90YXRpb24uXHJcbiAgICAgICAgICogSmF2YVNjcmlwdCdzIE51bWJlciB0eXBlOiAyMVxyXG4gICAgICAgICAqIDEwMDAwMDAgaXMgdGhlIG1heGltdW0gcmVjb21tZW5kZWQgZXhwb25lbnQgdmFsdWUgb2YgYSBCaWcuXHJcbiAgICAgICAgICogKFRoaXMgbGltaXQgaXMgbm90IGVuZm9yY2VkIG9yIGNoZWNrZWQuKVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEVfUE9TID0gMjEsICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gMTAwMDAwMFxyXG5cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgLy8gVGhlIHNoYXJlZCBwcm90b3R5cGUgb2JqZWN0LlxyXG4gICAgICAgIFAgPSB7fSxcclxuICAgICAgICBpc1ZhbGlkID0gL14tPyhcXGQrKFxcLlxcZCopP3xcXC5cXGQrKShlWystXT9cXGQrKT8kL2ksXHJcbiAgICAgICAgQmlnO1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogQ3JlYXRlIGFuZCByZXR1cm4gYSBCaWcgY29uc3RydWN0b3IuXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBiaWdGYWN0b3J5KCkge1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRoZSBCaWcgY29uc3RydWN0b3IgYW5kIGV4cG9ydGVkIGZ1bmN0aW9uLlxyXG4gICAgICAgICAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgbmV3IGluc3RhbmNlIG9mIGEgQmlnIG51bWJlciBvYmplY3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBuIHtudW1iZXJ8c3RyaW5nfEJpZ30gQSBudW1lcmljIHZhbHVlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIEJpZyhuKSB7XHJcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIC8vIEVuYWJsZSBjb25zdHJ1Y3RvciB1c2FnZSB3aXRob3V0IG5ldy5cclxuICAgICAgICAgICAgaWYgKCEoeCBpbnN0YW5jZW9mIEJpZykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuID09PSB2b2lkIDAgPyBiaWdGYWN0b3J5KCkgOiBuZXcgQmlnKG4pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBEdXBsaWNhdGUuXHJcbiAgICAgICAgICAgIGlmIChuIGluc3RhbmNlb2YgQmlnKSB7XHJcbiAgICAgICAgICAgICAgICB4LnMgPSBuLnM7XHJcbiAgICAgICAgICAgICAgICB4LmUgPSBuLmU7XHJcbiAgICAgICAgICAgICAgICB4LmMgPSBuLmMuc2xpY2UoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBhcnNlKHgsIG4pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBSZXRhaW4gYSByZWZlcmVuY2UgdG8gdGhpcyBCaWcgY29uc3RydWN0b3IsIGFuZCBzaGFkb3dcclxuICAgICAgICAgICAgICogQmlnLnByb3RvdHlwZS5jb25zdHJ1Y3RvciB3aGljaCBwb2ludHMgdG8gT2JqZWN0LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgeC5jb25zdHJ1Y3RvciA9IEJpZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEJpZy5wcm90b3R5cGUgPSBQO1xyXG4gICAgICAgIEJpZy5EUCA9IERQO1xyXG4gICAgICAgIEJpZy5STSA9IFJNO1xyXG4gICAgICAgIEJpZy5FX05FRyA9IEVfTkVHO1xyXG4gICAgICAgIEJpZy5FX1BPUyA9IEVfUE9TO1xyXG5cclxuICAgICAgICByZXR1cm4gQmlnO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyBQcml2YXRlIGZ1bmN0aW9uc1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgQmlnIHggaW4gbm9ybWFsIG9yIGV4cG9uZW50aWFsXHJcbiAgICAgKiBub3RhdGlvbiB0byBkcCBmaXhlZCBkZWNpbWFsIHBsYWNlcyBvciBzaWduaWZpY2FudCBkaWdpdHMuXHJcbiAgICAgKlxyXG4gICAgICogeCB7QmlnfSBUaGUgQmlnIHRvIGZvcm1hdC5cclxuICAgICAqIGRwIHtudW1iZXJ9IEludGVnZXIsIDAgdG8gTUFYX0RQIGluY2x1c2l2ZS5cclxuICAgICAqIHRvRSB7bnVtYmVyfSAxICh0b0V4cG9uZW50aWFsKSwgMiAodG9QcmVjaXNpb24pIG9yIHVuZGVmaW5lZCAodG9GaXhlZCkuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGZvcm1hdCh4LCBkcCwgdG9FKSB7XHJcbiAgICAgICAgdmFyIEJpZyA9IHguY29uc3RydWN0b3IsXHJcblxyXG4gICAgICAgICAgICAvLyBUaGUgaW5kZXggKG5vcm1hbCBub3RhdGlvbikgb2YgdGhlIGRpZ2l0IHRoYXQgbWF5IGJlIHJvdW5kZWQgdXAuXHJcbiAgICAgICAgICAgIGkgPSBkcCAtICh4ID0gbmV3IEJpZyh4KSkuZSxcclxuICAgICAgICAgICAgYyA9IHguYztcclxuXHJcbiAgICAgICAgLy8gUm91bmQ/XHJcbiAgICAgICAgaWYgKGMubGVuZ3RoID4gKytkcCkge1xyXG4gICAgICAgICAgICBybmQoeCwgaSwgQmlnLlJNKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghY1swXSkge1xyXG4gICAgICAgICAgICArK2k7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0b0UpIHtcclxuICAgICAgICAgICAgaSA9IGRwO1xyXG5cclxuICAgICAgICAvLyB0b0ZpeGVkXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYyA9IHguYztcclxuXHJcbiAgICAgICAgICAgIC8vIFJlY2FsY3VsYXRlIGkgYXMgeC5lIG1heSBoYXZlIGNoYW5nZWQgaWYgdmFsdWUgcm91bmRlZCB1cC5cclxuICAgICAgICAgICAgaSA9IHguZSArIGkgKyAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQXBwZW5kIHplcm9zP1xyXG4gICAgICAgIGZvciAoOyBjLmxlbmd0aCA8IGk7IGMucHVzaCgwKSkge1xyXG4gICAgICAgIH1cclxuICAgICAgICBpID0geC5lO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHRvUHJlY2lzaW9uIHJldHVybnMgZXhwb25lbnRpYWwgbm90YXRpb24gaWYgdGhlIG51bWJlciBvZlxyXG4gICAgICAgICAqIHNpZ25pZmljYW50IGRpZ2l0cyBzcGVjaWZpZWQgaXMgbGVzcyB0aGFuIHRoZSBudW1iZXIgb2YgZGlnaXRzXHJcbiAgICAgICAgICogbmVjZXNzYXJ5IHRvIHJlcHJlc2VudCB0aGUgaW50ZWdlciBwYXJ0IG9mIHRoZSB2YWx1ZSBpbiBub3JtYWxcclxuICAgICAgICAgKiBub3RhdGlvbi5cclxuICAgICAgICAgKi9cclxuICAgICAgICByZXR1cm4gdG9FID09PSAxIHx8IHRvRSAmJiAoZHAgPD0gaSB8fCBpIDw9IEJpZy5FX05FRykgP1xyXG5cclxuICAgICAgICAgIC8vIEV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAgICAgICAgKHgucyA8IDAgJiYgY1swXSA/ICctJyA6ICcnKSArXHJcbiAgICAgICAgICAgIChjLmxlbmd0aCA+IDEgPyBjWzBdICsgJy4nICsgYy5qb2luKCcnKS5zbGljZSgxKSA6IGNbMF0pICtcclxuICAgICAgICAgICAgICAoaSA8IDAgPyAnZScgOiAnZSsnKSArIGlcclxuXHJcbiAgICAgICAgICAvLyBOb3JtYWwgbm90YXRpb24uXHJcbiAgICAgICAgICA6IHgudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFBhcnNlIHRoZSBudW1iZXIgb3Igc3RyaW5nIHZhbHVlIHBhc3NlZCB0byBhIEJpZyBjb25zdHJ1Y3Rvci5cclxuICAgICAqXHJcbiAgICAgKiB4IHtCaWd9IEEgQmlnIG51bWJlciBpbnN0YW5jZS5cclxuICAgICAqIG4ge251bWJlcnxzdHJpbmd9IEEgbnVtZXJpYyB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcGFyc2UoeCwgbikge1xyXG4gICAgICAgIHZhciBlLCBpLCBuTDtcclxuXHJcbiAgICAgICAgLy8gTWludXMgemVybz9cclxuICAgICAgICBpZiAobiA9PT0gMCAmJiAxIC8gbiA8IDApIHtcclxuICAgICAgICAgICAgbiA9ICctMCc7XHJcblxyXG4gICAgICAgIC8vIEVuc3VyZSBuIGlzIHN0cmluZyBhbmQgY2hlY2sgdmFsaWRpdHkuXHJcbiAgICAgICAgfSBlbHNlIGlmICghaXNWYWxpZC50ZXN0KG4gKz0gJycpKSB7XHJcbiAgICAgICAgICAgIHRocm93RXJyKE5hTik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBEZXRlcm1pbmUgc2lnbi5cclxuICAgICAgICB4LnMgPSBuLmNoYXJBdCgwKSA9PSAnLScgPyAobiA9IG4uc2xpY2UoMSksIC0xKSA6IDE7XHJcblxyXG4gICAgICAgIC8vIERlY2ltYWwgcG9pbnQ/XHJcbiAgICAgICAgaWYgKChlID0gbi5pbmRleE9mKCcuJykpID4gLTEpIHtcclxuICAgICAgICAgICAgbiA9IG4ucmVwbGFjZSgnLicsICcnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEV4cG9uZW50aWFsIGZvcm0/XHJcbiAgICAgICAgaWYgKChpID0gbi5zZWFyY2goL2UvaSkpID4gMCkge1xyXG5cclxuICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIGV4cG9uZW50LlxyXG4gICAgICAgICAgICBpZiAoZSA8IDApIHtcclxuICAgICAgICAgICAgICAgIGUgPSBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGUgKz0gK24uc2xpY2UoaSArIDEpO1xyXG4gICAgICAgICAgICBuID0gbi5zdWJzdHJpbmcoMCwgaSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoZSA8IDApIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEludGVnZXIuXHJcbiAgICAgICAgICAgIGUgPSBuLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIERldGVybWluZSBsZWFkaW5nIHplcm9zLlxyXG4gICAgICAgIGZvciAoaSA9IDA7IG4uY2hhckF0KGkpID09ICcwJzsgaSsrKSB7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaSA9PSAobkwgPSBuLmxlbmd0aCkpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFplcm8uXHJcbiAgICAgICAgICAgIHguYyA9IFsgeC5lID0gMCBdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAvLyBEZXRlcm1pbmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICAgICAgICAgIGZvciAoOyBuLmNoYXJBdCgtLW5MKSA9PSAnMCc7KSB7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHguZSA9IGUgLSBpIC0gMTtcclxuICAgICAgICAgICAgeC5jID0gW107XHJcblxyXG4gICAgICAgICAgICAvLyBDb252ZXJ0IHN0cmluZyB0byBhcnJheSBvZiBkaWdpdHMgd2l0aG91dCBsZWFkaW5nL3RyYWlsaW5nIHplcm9zLlxyXG4gICAgICAgICAgICBmb3IgKGUgPSAwOyBpIDw9IG5MOyB4LmNbZSsrXSA9ICtuLmNoYXJBdChpKyspKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB4O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUm91bmQgQmlnIHggdG8gYSBtYXhpbXVtIG9mIGRwIGRlY2ltYWwgcGxhY2VzIHVzaW5nIHJvdW5kaW5nIG1vZGUgcm0uXHJcbiAgICAgKiBDYWxsZWQgYnkgZGl2LCBzcXJ0IGFuZCByb3VuZC5cclxuICAgICAqXHJcbiAgICAgKiB4IHtCaWd9IFRoZSBCaWcgdG8gcm91bmQuXHJcbiAgICAgKiBkcCB7bnVtYmVyfSBJbnRlZ2VyLCAwIHRvIE1BWF9EUCBpbmNsdXNpdmUuXHJcbiAgICAgKiBybSB7bnVtYmVyfSAwLCAxLCAyIG9yIDMgKERPV04sIEhBTEZfVVAsIEhBTEZfRVZFTiwgVVApXHJcbiAgICAgKiBbbW9yZV0ge2Jvb2xlYW59IFdoZXRoZXIgdGhlIHJlc3VsdCBvZiBkaXZpc2lvbiB3YXMgdHJ1bmNhdGVkLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBybmQoeCwgZHAsIHJtLCBtb3JlKSB7XHJcbiAgICAgICAgdmFyIHUsXHJcbiAgICAgICAgICAgIHhjID0geC5jLFxyXG4gICAgICAgICAgICBpID0geC5lICsgZHAgKyAxO1xyXG5cclxuICAgICAgICBpZiAocm0gPT09IDEpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIHhjW2ldIGlzIHRoZSBkaWdpdCBhZnRlciB0aGUgZGlnaXQgdGhhdCBtYXkgYmUgcm91bmRlZCB1cC5cclxuICAgICAgICAgICAgbW9yZSA9IHhjW2ldID49IDU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChybSA9PT0gMikge1xyXG4gICAgICAgICAgICBtb3JlID0geGNbaV0gPiA1IHx8IHhjW2ldID09IDUgJiZcclxuICAgICAgICAgICAgICAobW9yZSB8fCBpIDwgMCB8fCB4Y1tpICsgMV0gIT09IHUgfHwgeGNbaSAtIDFdICYgMSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChybSA9PT0gMykge1xyXG4gICAgICAgICAgICBtb3JlID0gbW9yZSB8fCB4Y1tpXSAhPT0gdSB8fCBpIDwgMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBtb3JlID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAocm0gIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRocm93RXJyKCchQmlnLlJNIScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaSA8IDEgfHwgIXhjWzBdKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAobW9yZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIDEsIDAuMSwgMC4wMSwgMC4wMDEsIDAuMDAwMSBldGMuXHJcbiAgICAgICAgICAgICAgICB4LmUgPSAtZHA7XHJcbiAgICAgICAgICAgICAgICB4LmMgPSBbMV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gWmVyby5cclxuICAgICAgICAgICAgICAgIHguYyA9IFt4LmUgPSAwXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAvLyBSZW1vdmUgYW55IGRpZ2l0cyBhZnRlciB0aGUgcmVxdWlyZWQgZGVjaW1hbCBwbGFjZXMuXHJcbiAgICAgICAgICAgIHhjLmxlbmd0aCA9IGktLTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJvdW5kIHVwP1xyXG4gICAgICAgICAgICBpZiAobW9yZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJvdW5kaW5nIHVwIG1heSBtZWFuIHRoZSBwcmV2aW91cyBkaWdpdCBoYXMgdG8gYmUgcm91bmRlZCB1cC5cclxuICAgICAgICAgICAgICAgIGZvciAoOyArK3hjW2ldID4gOTspIHtcclxuICAgICAgICAgICAgICAgICAgICB4Y1tpXSA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaS0tKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsreC5lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4Yy51bnNoaWZ0KDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgICAgICAgICBmb3IgKGkgPSB4Yy5sZW5ndGg7ICF4Y1stLWldOyB4Yy5wb3AoKSkge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4geDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFRocm93IGEgQmlnRXJyb3IuXHJcbiAgICAgKlxyXG4gICAgICogbWVzc2FnZSB7c3RyaW5nfSBUaGUgZXJyb3IgbWVzc2FnZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdGhyb3dFcnIobWVzc2FnZSkge1xyXG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IobWVzc2FnZSk7XHJcbiAgICAgICAgZXJyLm5hbWUgPSAnQmlnRXJyb3InO1xyXG5cclxuICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vIFByb3RvdHlwZS9pbnN0YW5jZSBtZXRob2RzXHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYSBuZXcgQmlnIHdob3NlIHZhbHVlIGlzIHRoZSBhYnNvbHV0ZSB2YWx1ZSBvZiB0aGlzIEJpZy5cclxuICAgICAqL1xyXG4gICAgUC5hYnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHggPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKTtcclxuICAgICAgICB4LnMgPSAxO1xyXG5cclxuICAgICAgICByZXR1cm4geDtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5cclxuICAgICAqIDEgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIGlzIGdyZWF0ZXIgdGhhbiB0aGUgdmFsdWUgb2YgQmlnIHksXHJcbiAgICAgKiAtMSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgaXMgbGVzcyB0aGFuIHRoZSB2YWx1ZSBvZiBCaWcgeSwgb3JcclxuICAgICAqIDAgaWYgdGhleSBoYXZlIHRoZSBzYW1lIHZhbHVlLlxyXG4gICAgKi9cclxuICAgIFAuY21wID0gZnVuY3Rpb24gKHkpIHtcclxuICAgICAgICB2YXIgeE5lZyxcclxuICAgICAgICAgICAgeCA9IHRoaXMsXHJcbiAgICAgICAgICAgIHhjID0geC5jLFxyXG4gICAgICAgICAgICB5YyA9ICh5ID0gbmV3IHguY29uc3RydWN0b3IoeSkpLmMsXHJcbiAgICAgICAgICAgIGkgPSB4LnMsXHJcbiAgICAgICAgICAgIGogPSB5LnMsXHJcbiAgICAgICAgICAgIGsgPSB4LmUsXHJcbiAgICAgICAgICAgIGwgPSB5LmU7XHJcblxyXG4gICAgICAgIC8vIEVpdGhlciB6ZXJvP1xyXG4gICAgICAgIGlmICgheGNbMF0gfHwgIXljWzBdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAheGNbMF0gPyAheWNbMF0gPyAwIDogLWogOiBpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2lnbnMgZGlmZmVyP1xyXG4gICAgICAgIGlmIChpICE9IGopIHtcclxuICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHhOZWcgPSBpIDwgMDtcclxuXHJcbiAgICAgICAgLy8gQ29tcGFyZSBleHBvbmVudHMuXHJcbiAgICAgICAgaWYgKGsgIT0gbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gayA+IGwgXiB4TmVnID8gMSA6IC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaSA9IC0xO1xyXG4gICAgICAgIGogPSAoayA9IHhjLmxlbmd0aCkgPCAobCA9IHljLmxlbmd0aCkgPyBrIDogbDtcclxuXHJcbiAgICAgICAgLy8gQ29tcGFyZSBkaWdpdCBieSBkaWdpdC5cclxuICAgICAgICBmb3IgKDsgKytpIDwgajspIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh4Y1tpXSAhPSB5Y1tpXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHhjW2ldID4geWNbaV0gXiB4TmVnID8gMSA6IC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDb21wYXJlIGxlbmd0aHMuXHJcbiAgICAgICAgcmV0dXJuIGsgPT0gbCA/IDAgOiBrID4gbCBeIHhOZWcgPyAxIDogLTE7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIGEgbmV3IEJpZyB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgZGl2aWRlZCBieSB0aGVcclxuICAgICAqIHZhbHVlIG9mIEJpZyB5LCByb3VuZGVkLCBpZiBuZWNlc3NhcnksIHRvIGEgbWF4aW11bSBvZiBCaWcuRFAgZGVjaW1hbFxyXG4gICAgICogcGxhY2VzIHVzaW5nIHJvdW5kaW5nIG1vZGUgQmlnLlJNLlxyXG4gICAgICovXHJcbiAgICBQLmRpdiA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICAgICAgdmFyIHggPSB0aGlzLFxyXG4gICAgICAgICAgICBCaWcgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICAgICAgICAvLyBkaXZpZGVuZFxyXG4gICAgICAgICAgICBkdmQgPSB4LmMsXHJcbiAgICAgICAgICAgIC8vZGl2aXNvclxyXG4gICAgICAgICAgICBkdnMgPSAoeSA9IG5ldyBCaWcoeSkpLmMsXHJcbiAgICAgICAgICAgIHMgPSB4LnMgPT0geS5zID8gMSA6IC0xLFxyXG4gICAgICAgICAgICBkcCA9IEJpZy5EUDtcclxuXHJcbiAgICAgICAgaWYgKGRwICE9PSB+fmRwIHx8IGRwIDwgMCB8fCBkcCA+IE1BWF9EUCkge1xyXG4gICAgICAgICAgICB0aHJvd0VycignIUJpZy5EUCEnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEVpdGhlciAwP1xyXG4gICAgICAgIGlmICghZHZkWzBdIHx8ICFkdnNbMF0pIHtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIGJvdGggYXJlIDAsIHRocm93IE5hTlxyXG4gICAgICAgICAgICBpZiAoZHZkWzBdID09IGR2c1swXSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3dFcnIoTmFOKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSWYgZHZzIGlzIDAsIHRocm93ICstSW5maW5pdHkuXHJcbiAgICAgICAgICAgIGlmICghZHZzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvd0VycihzIC8gMCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGR2ZCBpcyAwLCByZXR1cm4gKy0wLlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEJpZyhzICogMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZHZzTCwgZHZzVCwgbmV4dCwgY21wLCByZW1JLCB1LFxyXG4gICAgICAgICAgICBkdnNaID0gZHZzLnNsaWNlKCksXHJcbiAgICAgICAgICAgIGR2ZEkgPSBkdnNMID0gZHZzLmxlbmd0aCxcclxuICAgICAgICAgICAgZHZkTCA9IGR2ZC5sZW5ndGgsXHJcbiAgICAgICAgICAgIC8vIHJlbWFpbmRlclxyXG4gICAgICAgICAgICByZW0gPSBkdmQuc2xpY2UoMCwgZHZzTCksXHJcbiAgICAgICAgICAgIHJlbUwgPSByZW0ubGVuZ3RoLFxyXG4gICAgICAgICAgICAvLyBxdW90aWVudFxyXG4gICAgICAgICAgICBxID0geSxcclxuICAgICAgICAgICAgcWMgPSBxLmMgPSBbXSxcclxuICAgICAgICAgICAgcWkgPSAwLFxyXG4gICAgICAgICAgICBkaWdpdHMgPSBkcCArIChxLmUgPSB4LmUgLSB5LmUpICsgMTtcclxuXHJcbiAgICAgICAgcS5zID0gcztcclxuICAgICAgICBzID0gZGlnaXRzIDwgMCA/IDAgOiBkaWdpdHM7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB2ZXJzaW9uIG9mIGRpdmlzb3Igd2l0aCBsZWFkaW5nIHplcm8uXHJcbiAgICAgICAgZHZzWi51bnNoaWZ0KDApO1xyXG5cclxuICAgICAgICAvLyBBZGQgemVyb3MgdG8gbWFrZSByZW1haW5kZXIgYXMgbG9uZyBhcyBkaXZpc29yLlxyXG4gICAgICAgIGZvciAoOyByZW1MKysgPCBkdnNMOyByZW0ucHVzaCgwKSkge1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG8ge1xyXG5cclxuICAgICAgICAgICAgLy8gJ25leHQnIGlzIGhvdyBtYW55IHRpbWVzIHRoZSBkaXZpc29yIGdvZXMgaW50byBjdXJyZW50IHJlbWFpbmRlci5cclxuICAgICAgICAgICAgZm9yIChuZXh0ID0gMDsgbmV4dCA8IDEwOyBuZXh0KyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDb21wYXJlIGRpdmlzb3IgYW5kIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICAgIGlmIChkdnNMICE9IChyZW1MID0gcmVtLmxlbmd0aCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbXAgPSBkdnNMID4gcmVtTCA/IDEgOiAtMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAocmVtSSA9IC0xLCBjbXAgPSAwOyArK3JlbUkgPCBkdnNMOykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGR2c1tyZW1JXSAhPSByZW1bcmVtSV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNtcCA9IGR2c1tyZW1JXSA+IHJlbVtyZW1JXSA/IDEgOiAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIElmIGRpdmlzb3IgPCByZW1haW5kZXIsIHN1YnRyYWN0IGRpdmlzb3IgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgICBpZiAoY21wIDwgMCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBSZW1haW5kZXIgY2FuJ3QgYmUgbW9yZSB0aGFuIDEgZGlnaXQgbG9uZ2VyIHRoYW4gZGl2aXNvci5cclxuICAgICAgICAgICAgICAgICAgICAvLyBFcXVhbGlzZSBsZW5ndGhzIHVzaW5nIGRpdmlzb3Igd2l0aCBleHRyYSBsZWFkaW5nIHplcm8/XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChkdnNUID0gcmVtTCA9PSBkdnNMID8gZHZzIDogZHZzWjsgcmVtTDspIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZW1bLS1yZW1MXSA8IGR2c1RbcmVtTF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbUkgPSByZW1MO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoOyByZW1JICYmICFyZW1bLS1yZW1JXTsgcmVtW3JlbUldID0gOSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLS1yZW1bcmVtSV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1bcmVtTF0gKz0gMTA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtW3JlbUxdIC09IGR2c1RbcmVtTF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoOyAhcmVtWzBdOyByZW0uc2hpZnQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCB0aGUgJ25leHQnIGRpZ2l0IHRvIHRoZSByZXN1bHQgYXJyYXkuXHJcbiAgICAgICAgICAgIHFjW3FpKytdID0gY21wID8gbmV4dCA6ICsrbmV4dDtcclxuXHJcbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICBpZiAocmVtWzBdICYmIGNtcCkge1xyXG4gICAgICAgICAgICAgICAgcmVtW3JlbUxdID0gZHZkW2R2ZEldIHx8IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZW0gPSBbIGR2ZFtkdmRJXSBdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gd2hpbGUgKChkdmRJKysgPCBkdmRMIHx8IHJlbVswXSAhPT0gdSkgJiYgcy0tKTtcclxuXHJcbiAgICAgICAgLy8gTGVhZGluZyB6ZXJvPyBEbyBub3QgcmVtb3ZlIGlmIHJlc3VsdCBpcyBzaW1wbHkgemVybyAocWkgPT0gMSkuXHJcbiAgICAgICAgaWYgKCFxY1swXSAmJiBxaSAhPSAxKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBUaGVyZSBjYW4ndCBiZSBtb3JlIHRoYW4gb25lIHplcm8uXHJcbiAgICAgICAgICAgIHFjLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIHEuZS0tO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUm91bmQ/XHJcbiAgICAgICAgaWYgKHFpID4gZGlnaXRzKSB7XHJcbiAgICAgICAgICAgIHJuZChxLCBkcCwgQmlnLlJNLCByZW1bMF0gIT09IHUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHE7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIGlzIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZiBCaWcgeSxcclxuICAgICAqIG90aGVyd2lzZSByZXR1cm5zIGZhbHNlLlxyXG4gICAgICovXHJcbiAgICBQLmVxID0gZnVuY3Rpb24gKHkpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXMuY21wKHkpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBpcyBncmVhdGVyIHRoYW4gdGhlIHZhbHVlIG9mIEJpZyB5LFxyXG4gICAgICogb3RoZXJ3aXNlIHJldHVybnMgZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIFAuZ3QgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNtcCh5KSA+IDA7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGVcclxuICAgICAqIHZhbHVlIG9mIEJpZyB5LCBvdGhlcndpc2UgcmV0dXJucyBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgUC5ndGUgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNtcCh5KSA+IC0xO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBpcyBsZXNzIHRoYW4gdGhlIHZhbHVlIG9mIEJpZyB5LFxyXG4gICAgICogb3RoZXJ3aXNlIHJldHVybnMgZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIFAubHQgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNtcCh5KSA8IDA7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgdmFsdWVcclxuICAgICAqIG9mIEJpZyB5LCBvdGhlcndpc2UgcmV0dXJucyBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgUC5sdGUgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgICAgICByZXR1cm4gdGhpcy5jbXAoeSkgPCAxO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIG5ldyBCaWcgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIG1pbnVzIHRoZSB2YWx1ZVxyXG4gICAgICogb2YgQmlnIHkuXHJcbiAgICAgKi9cclxuICAgIFAuc3ViID0gUC5taW51cyA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICAgICAgdmFyIGksIGosIHQsIHhMVHksXHJcbiAgICAgICAgICAgIHggPSB0aGlzLFxyXG4gICAgICAgICAgICBCaWcgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICAgICAgICBhID0geC5zLFxyXG4gICAgICAgICAgICBiID0gKHkgPSBuZXcgQmlnKHkpKS5zO1xyXG5cclxuICAgICAgICAvLyBTaWducyBkaWZmZXI/XHJcbiAgICAgICAgaWYgKGEgIT0gYikge1xyXG4gICAgICAgICAgICB5LnMgPSAtYjtcclxuICAgICAgICAgICAgcmV0dXJuIHgucGx1cyh5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB4YyA9IHguYy5zbGljZSgpLFxyXG4gICAgICAgICAgICB4ZSA9IHguZSxcclxuICAgICAgICAgICAgeWMgPSB5LmMsXHJcbiAgICAgICAgICAgIHllID0geS5lO1xyXG5cclxuICAgICAgICAvLyBFaXRoZXIgemVybz9cclxuICAgICAgICBpZiAoIXhjWzBdIHx8ICF5Y1swXSkge1xyXG5cclxuICAgICAgICAgICAgLy8geSBpcyBub24temVybz8geCBpcyBub24temVybz8gT3IgYm90aCBhcmUgemVyby5cclxuICAgICAgICAgICAgcmV0dXJuIHljWzBdID8gKHkucyA9IC1iLCB5KSA6IG5ldyBCaWcoeGNbMF0gPyB4IDogMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBEZXRlcm1pbmUgd2hpY2ggaXMgdGhlIGJpZ2dlciBudW1iZXIuXHJcbiAgICAgICAgLy8gUHJlcGVuZCB6ZXJvcyB0byBlcXVhbGlzZSBleHBvbmVudHMuXHJcbiAgICAgICAgaWYgKGEgPSB4ZSAtIHllKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoeExUeSA9IGEgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBhID0gLWE7XHJcbiAgICAgICAgICAgICAgICB0ID0geGM7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB5ZSA9IHhlO1xyXG4gICAgICAgICAgICAgICAgdCA9IHljO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0LnJldmVyc2UoKTtcclxuICAgICAgICAgICAgZm9yIChiID0gYTsgYi0tOyB0LnB1c2goMCkpIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0LnJldmVyc2UoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgLy8gRXhwb25lbnRzIGVxdWFsLiBDaGVjayBkaWdpdCBieSBkaWdpdC5cclxuICAgICAgICAgICAgaiA9ICgoeExUeSA9IHhjLmxlbmd0aCA8IHljLmxlbmd0aCkgPyB4YyA6IHljKS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGEgPSBiID0gMDsgYiA8IGo7IGIrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh4Y1tiXSAhPSB5Y1tiXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHhMVHkgPSB4Y1tiXSA8IHljW2JdO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB4IDwgeT8gUG9pbnQgeGMgdG8gdGhlIGFycmF5IG9mIHRoZSBiaWdnZXIgbnVtYmVyLlxyXG4gICAgICAgIGlmICh4TFR5KSB7XHJcbiAgICAgICAgICAgIHQgPSB4YztcclxuICAgICAgICAgICAgeGMgPSB5YztcclxuICAgICAgICAgICAgeWMgPSB0O1xyXG4gICAgICAgICAgICB5LnMgPSAteS5zO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBBcHBlbmQgemVyb3MgdG8geGMgaWYgc2hvcnRlci4gTm8gbmVlZCB0byBhZGQgemVyb3MgdG8geWMgaWYgc2hvcnRlclxyXG4gICAgICAgICAqIGFzIHN1YnRyYWN0aW9uIG9ubHkgbmVlZHMgdG8gc3RhcnQgYXQgeWMubGVuZ3RoLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICgoIGIgPSAoaiA9IHljLmxlbmd0aCkgLSAoaSA9IHhjLmxlbmd0aCkgKSA+IDApIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAoOyBiLS07IHhjW2krK10gPSAwKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFN1YnRyYWN0IHljIGZyb20geGMuXHJcbiAgICAgICAgZm9yIChiID0gaTsgaiA+IGE7KXtcclxuXHJcbiAgICAgICAgICAgIGlmICh4Y1stLWpdIDwgeWNbal0pIHtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSBqOyBpICYmICF4Y1stLWldOyB4Y1tpXSA9IDkpIHtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC0teGNbaV07XHJcbiAgICAgICAgICAgICAgICB4Y1tqXSArPSAxMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB4Y1tqXSAtPSB5Y1tqXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgICAgICBmb3IgKDsgeGNbLS1iXSA9PT0gMDsgeGMucG9wKCkpIHtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJlbW92ZSBsZWFkaW5nIHplcm9zIGFuZCBhZGp1c3QgZXhwb25lbnQgYWNjb3JkaW5nbHkuXHJcbiAgICAgICAgZm9yICg7IHhjWzBdID09PSAwOykge1xyXG4gICAgICAgICAgICB4Yy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAtLXllO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF4Y1swXSkge1xyXG5cclxuICAgICAgICAgICAgLy8gbiAtIG4gPSArMFxyXG4gICAgICAgICAgICB5LnMgPSAxO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVzdWx0IG11c3QgYmUgemVyby5cclxuICAgICAgICAgICAgeGMgPSBbeWUgPSAwXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHkuYyA9IHhjO1xyXG4gICAgICAgIHkuZSA9IHllO1xyXG5cclxuICAgICAgICByZXR1cm4geTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYSBuZXcgQmlnIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBtb2R1bG8gdGhlXHJcbiAgICAgKiB2YWx1ZSBvZiBCaWcgeS5cclxuICAgICAqL1xyXG4gICAgUC5tb2QgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgICAgIHZhciB5R1R4LFxyXG4gICAgICAgICAgICB4ID0gdGhpcyxcclxuICAgICAgICAgICAgQmlnID0geC5jb25zdHJ1Y3RvcixcclxuICAgICAgICAgICAgYSA9IHgucyxcclxuICAgICAgICAgICAgYiA9ICh5ID0gbmV3IEJpZyh5KSkucztcclxuXHJcbiAgICAgICAgaWYgKCF5LmNbMF0pIHtcclxuICAgICAgICAgICAgdGhyb3dFcnIoTmFOKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHgucyA9IHkucyA9IDE7XHJcbiAgICAgICAgeUdUeCA9IHkuY21wKHgpID09IDE7XHJcbiAgICAgICAgeC5zID0gYTtcclxuICAgICAgICB5LnMgPSBiO1xyXG5cclxuICAgICAgICBpZiAoeUdUeCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEJpZyh4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGEgPSBCaWcuRFA7XHJcbiAgICAgICAgYiA9IEJpZy5STTtcclxuICAgICAgICBCaWcuRFAgPSBCaWcuUk0gPSAwO1xyXG4gICAgICAgIHggPSB4LmRpdih5KTtcclxuICAgICAgICBCaWcuRFAgPSBhO1xyXG4gICAgICAgIEJpZy5STSA9IGI7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLm1pbnVzKCB4LnRpbWVzKHkpICk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIGEgbmV3IEJpZyB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgcGx1cyB0aGUgdmFsdWVcclxuICAgICAqIG9mIEJpZyB5LlxyXG4gICAgICovXHJcbiAgICBQLmFkZCA9IFAucGx1cyA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICAgICAgdmFyIHQsXHJcbiAgICAgICAgICAgIHggPSB0aGlzLFxyXG4gICAgICAgICAgICBCaWcgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICAgICAgICBhID0geC5zLFxyXG4gICAgICAgICAgICBiID0gKHkgPSBuZXcgQmlnKHkpKS5zO1xyXG5cclxuICAgICAgICAvLyBTaWducyBkaWZmZXI/XHJcbiAgICAgICAgaWYgKGEgIT0gYikge1xyXG4gICAgICAgICAgICB5LnMgPSAtYjtcclxuICAgICAgICAgICAgcmV0dXJuIHgubWludXMoeSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgeGUgPSB4LmUsXHJcbiAgICAgICAgICAgIHhjID0geC5jLFxyXG4gICAgICAgICAgICB5ZSA9IHkuZSxcclxuICAgICAgICAgICAgeWMgPSB5LmM7XHJcblxyXG4gICAgICAgIC8vIEVpdGhlciB6ZXJvP1xyXG4gICAgICAgIGlmICgheGNbMF0gfHwgIXljWzBdKSB7XHJcblxyXG4gICAgICAgICAgICAvLyB5IGlzIG5vbi16ZXJvPyB4IGlzIG5vbi16ZXJvPyBPciBib3RoIGFyZSB6ZXJvLlxyXG4gICAgICAgICAgICByZXR1cm4geWNbMF0gPyB5IDogbmV3IEJpZyh4Y1swXSA/IHggOiBhICogMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHhjID0geGMuc2xpY2UoKTtcclxuXHJcbiAgICAgICAgLy8gUHJlcGVuZCB6ZXJvcyB0byBlcXVhbGlzZSBleHBvbmVudHMuXHJcbiAgICAgICAgLy8gTm90ZTogRmFzdGVyIHRvIHVzZSByZXZlcnNlIHRoZW4gZG8gdW5zaGlmdHMuXHJcbiAgICAgICAgaWYgKGEgPSB4ZSAtIHllKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoYSA+IDApIHtcclxuICAgICAgICAgICAgICAgIHllID0geGU7XHJcbiAgICAgICAgICAgICAgICB0ID0geWM7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhID0gLWE7XHJcbiAgICAgICAgICAgICAgICB0ID0geGM7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHQucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICBmb3IgKDsgYS0tOyB0LnB1c2goMCkpIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0LnJldmVyc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFBvaW50IHhjIHRvIHRoZSBsb25nZXIgYXJyYXkuXHJcbiAgICAgICAgaWYgKHhjLmxlbmd0aCAtIHljLmxlbmd0aCA8IDApIHtcclxuICAgICAgICAgICAgdCA9IHljO1xyXG4gICAgICAgICAgICB5YyA9IHhjO1xyXG4gICAgICAgICAgICB4YyA9IHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGEgPSB5Yy5sZW5ndGg7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogT25seSBzdGFydCBhZGRpbmcgYXQgeWMubGVuZ3RoIC0gMSBhcyB0aGUgZnVydGhlciBkaWdpdHMgb2YgeGMgY2FuIGJlXHJcbiAgICAgICAgICogbGVmdCBhcyB0aGV5IGFyZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGIgPSAwOyBhOykge1xyXG4gICAgICAgICAgICBiID0gKHhjWy0tYV0gPSB4Y1thXSArIHljW2FdICsgYikgLyAxMCB8IDA7XHJcbiAgICAgICAgICAgIHhjW2FdICU9IDEwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTm8gbmVlZCB0byBjaGVjayBmb3IgemVybywgYXMgK3ggKyAreSAhPSAwICYmIC14ICsgLXkgIT0gMFxyXG5cclxuICAgICAgICBpZiAoYikge1xyXG4gICAgICAgICAgICB4Yy51bnNoaWZ0KGIpO1xyXG4gICAgICAgICAgICArK3llO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgICAgICBmb3IgKGEgPSB4Yy5sZW5ndGg7IHhjWy0tYV0gPT09IDA7IHhjLnBvcCgpKSB7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB5LmMgPSB4YztcclxuICAgICAgICB5LmUgPSB5ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIGEgQmlnIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyByYWlzZWQgdG8gdGhlIHBvd2VyIG4uXHJcbiAgICAgKiBJZiBuIGlzIG5lZ2F0aXZlLCByb3VuZCwgaWYgbmVjZXNzYXJ5LCB0byBhIG1heGltdW0gb2YgQmlnLkRQIGRlY2ltYWxcclxuICAgICAqIHBsYWNlcyB1c2luZyByb3VuZGluZyBtb2RlIEJpZy5STS5cclxuICAgICAqXHJcbiAgICAgKiBuIHtudW1iZXJ9IEludGVnZXIsIC1NQVhfUE9XRVIgdG8gTUFYX1BPV0VSIGluY2x1c2l2ZS5cclxuICAgICAqL1xyXG4gICAgUC5wb3cgPSBmdW5jdGlvbiAobikge1xyXG4gICAgICAgIHZhciB4ID0gdGhpcyxcclxuICAgICAgICAgICAgb25lID0gbmV3IHguY29uc3RydWN0b3IoMSksXHJcbiAgICAgICAgICAgIHkgPSBvbmUsXHJcbiAgICAgICAgICAgIGlzTmVnID0gbiA8IDA7XHJcblxyXG4gICAgICAgIGlmIChuICE9PSB+fm4gfHwgbiA8IC1NQVhfUE9XRVIgfHwgbiA+IE1BWF9QT1dFUikge1xyXG4gICAgICAgICAgICB0aHJvd0VycignIXBvdyEnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG4gPSBpc05lZyA/IC1uIDogbjtcclxuXHJcbiAgICAgICAgZm9yICg7Oykge1xyXG5cclxuICAgICAgICAgICAgaWYgKG4gJiAxKSB7XHJcbiAgICAgICAgICAgICAgICB5ID0geS50aW1lcyh4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuID4+PSAxO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFuKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB4ID0geC50aW1lcyh4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpc05lZyA/IG9uZS5kaXYoeSkgOiB5O1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIG5ldyBCaWcgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIHJvdW5kZWQgdG8gYVxyXG4gICAgICogbWF4aW11bSBvZiBkcCBkZWNpbWFsIHBsYWNlcyB1c2luZyByb3VuZGluZyBtb2RlIHJtLlxyXG4gICAgICogSWYgZHAgaXMgbm90IHNwZWNpZmllZCwgcm91bmQgdG8gMCBkZWNpbWFsIHBsYWNlcy5cclxuICAgICAqIElmIHJtIGlzIG5vdCBzcGVjaWZpZWQsIHVzZSBCaWcuUk0uXHJcbiAgICAgKlxyXG4gICAgICogW2RwXSB7bnVtYmVyfSBJbnRlZ2VyLCAwIHRvIE1BWF9EUCBpbmNsdXNpdmUuXHJcbiAgICAgKiBbcm1dIDAsIDEsIDIgb3IgMyAoUk9VTkRfRE9XTiwgUk9VTkRfSEFMRl9VUCwgUk9VTkRfSEFMRl9FVkVOLCBST1VORF9VUClcclxuICAgICAqL1xyXG4gICAgUC5yb3VuZCA9IGZ1bmN0aW9uIChkcCwgcm0pIHtcclxuICAgICAgICB2YXIgeCA9IHRoaXMsXHJcbiAgICAgICAgICAgIEJpZyA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgICAgIGlmIChkcCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGRwID0gMDtcclxuICAgICAgICB9IGVsc2UgaWYgKGRwICE9PSB+fmRwIHx8IGRwIDwgMCB8fCBkcCA+IE1BWF9EUCkge1xyXG4gICAgICAgICAgICB0aHJvd0VycignIXJvdW5kIScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBybmQoeCA9IG5ldyBCaWcoeCksIGRwLCBybSA9PSBudWxsID8gQmlnLlJNIDogcm0pO1xyXG5cclxuICAgICAgICByZXR1cm4geDtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYSBuZXcgQmlnIHdob3NlIHZhbHVlIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWcsXHJcbiAgICAgKiByb3VuZGVkLCBpZiBuZWNlc3NhcnksIHRvIGEgbWF4aW11bSBvZiBCaWcuRFAgZGVjaW1hbCBwbGFjZXMgdXNpbmdcclxuICAgICAqIHJvdW5kaW5nIG1vZGUgQmlnLlJNLlxyXG4gICAgICovXHJcbiAgICBQLnNxcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGVzdGltYXRlLCByLCBhcHByb3gsXHJcbiAgICAgICAgICAgIHggPSB0aGlzLFxyXG4gICAgICAgICAgICBCaWcgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICAgICAgICB4YyA9IHguYyxcclxuICAgICAgICAgICAgaSA9IHgucyxcclxuICAgICAgICAgICAgZSA9IHguZSxcclxuICAgICAgICAgICAgaGFsZiA9IG5ldyBCaWcoJzAuNScpO1xyXG5cclxuICAgICAgICAvLyBaZXJvP1xyXG4gICAgICAgIGlmICgheGNbMF0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBCaWcoeCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiBuZWdhdGl2ZSwgdGhyb3cgTmFOLlxyXG4gICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgICB0aHJvd0VycihOYU4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRXN0aW1hdGUuXHJcbiAgICAgICAgaSA9IE1hdGguc3FydCh4LnRvU3RyaW5nKCkpO1xyXG5cclxuICAgICAgICAvLyBNYXRoLnNxcnQgdW5kZXJmbG93L292ZXJmbG93P1xyXG4gICAgICAgIC8vIFBhc3MgeCB0byBNYXRoLnNxcnQgYXMgaW50ZWdlciwgdGhlbiBhZGp1c3QgdGhlIHJlc3VsdCBleHBvbmVudC5cclxuICAgICAgICBpZiAoaSA9PT0gMCB8fCBpID09PSAxIC8gMCkge1xyXG4gICAgICAgICAgICBlc3RpbWF0ZSA9IHhjLmpvaW4oJycpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCEoZXN0aW1hdGUubGVuZ3RoICsgZSAmIDEpKSB7XHJcbiAgICAgICAgICAgICAgICBlc3RpbWF0ZSArPSAnMCc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHIgPSBuZXcgQmlnKCBNYXRoLnNxcnQoZXN0aW1hdGUpLnRvU3RyaW5nKCkgKTtcclxuICAgICAgICAgICAgci5lID0gKChlICsgMSkgLyAyIHwgMCkgLSAoZSA8IDAgfHwgZSAmIDEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHIgPSBuZXcgQmlnKGkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpID0gci5lICsgKEJpZy5EUCArPSA0KTtcclxuXHJcbiAgICAgICAgLy8gTmV3dG9uLVJhcGhzb24gaXRlcmF0aW9uLlxyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgYXBwcm94ID0gcjtcclxuICAgICAgICAgICAgciA9IGhhbGYudGltZXMoIGFwcHJveC5wbHVzKCB4LmRpdihhcHByb3gpICkgKTtcclxuICAgICAgICB9IHdoaWxlICggYXBwcm94LmMuc2xpY2UoMCwgaSkuam9pbignJykgIT09XHJcbiAgICAgICAgICAgICAgICAgICAgICAgci5jLnNsaWNlKDAsIGkpLmpvaW4oJycpICk7XHJcblxyXG4gICAgICAgIHJuZChyLCBCaWcuRFAgLT0gNCwgQmlnLlJNKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHI7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIGEgbmV3IEJpZyB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgdGltZXMgdGhlIHZhbHVlIG9mXHJcbiAgICAgKiBCaWcgeS5cclxuICAgICAqL1xyXG4gICAgUC5tdWwgPSBQLnRpbWVzID0gZnVuY3Rpb24gKHkpIHtcclxuICAgICAgICB2YXIgYyxcclxuICAgICAgICAgICAgeCA9IHRoaXMsXHJcbiAgICAgICAgICAgIEJpZyA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgICAgICAgIHhjID0geC5jLFxyXG4gICAgICAgICAgICB5YyA9ICh5ID0gbmV3IEJpZyh5KSkuYyxcclxuICAgICAgICAgICAgYSA9IHhjLmxlbmd0aCxcclxuICAgICAgICAgICAgYiA9IHljLmxlbmd0aCxcclxuICAgICAgICAgICAgaSA9IHguZSxcclxuICAgICAgICAgICAgaiA9IHkuZTtcclxuXHJcbiAgICAgICAgLy8gRGV0ZXJtaW5lIHNpZ24gb2YgcmVzdWx0LlxyXG4gICAgICAgIHkucyA9IHgucyA9PSB5LnMgPyAxIDogLTE7XHJcblxyXG4gICAgICAgIC8vIFJldHVybiBzaWduZWQgMCBpZiBlaXRoZXIgMC5cclxuICAgICAgICBpZiAoIXhjWzBdIHx8ICF5Y1swXSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEJpZyh5LnMgKiAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEluaXRpYWxpc2UgZXhwb25lbnQgb2YgcmVzdWx0IGFzIHguZSArIHkuZS5cclxuICAgICAgICB5LmUgPSBpICsgajtcclxuXHJcbiAgICAgICAgLy8gSWYgYXJyYXkgeGMgaGFzIGZld2VyIGRpZ2l0cyB0aGFuIHljLCBzd2FwIHhjIGFuZCB5YywgYW5kIGxlbmd0aHMuXHJcbiAgICAgICAgaWYgKGEgPCBiKSB7XHJcbiAgICAgICAgICAgIGMgPSB4YztcclxuICAgICAgICAgICAgeGMgPSB5YztcclxuICAgICAgICAgICAgeWMgPSBjO1xyXG4gICAgICAgICAgICBqID0gYTtcclxuICAgICAgICAgICAgYSA9IGI7XHJcbiAgICAgICAgICAgIGIgPSBqO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSW5pdGlhbGlzZSBjb2VmZmljaWVudCBhcnJheSBvZiByZXN1bHQgd2l0aCB6ZXJvcy5cclxuICAgICAgICBmb3IgKGMgPSBuZXcgQXJyYXkoaiA9IGEgKyBiKTsgai0tOyBjW2pdID0gMCkge1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTXVsdGlwbHkuXHJcblxyXG4gICAgICAgIC8vIGkgaXMgaW5pdGlhbGx5IHhjLmxlbmd0aC5cclxuICAgICAgICBmb3IgKGkgPSBiOyBpLS07KSB7XHJcbiAgICAgICAgICAgIGIgPSAwO1xyXG5cclxuICAgICAgICAgICAgLy8gYSBpcyB5Yy5sZW5ndGguXHJcbiAgICAgICAgICAgIGZvciAoaiA9IGEgKyBpOyBqID4gaTspIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDdXJyZW50IHN1bSBvZiBwcm9kdWN0cyBhdCB0aGlzIGRpZ2l0IHBvc2l0aW9uLCBwbHVzIGNhcnJ5LlxyXG4gICAgICAgICAgICAgICAgYiA9IGNbal0gKyB5Y1tpXSAqIHhjW2ogLSBpIC0gMV0gKyBiO1xyXG4gICAgICAgICAgICAgICAgY1tqLS1dID0gYiAlIDEwO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNhcnJ5XHJcbiAgICAgICAgICAgICAgICBiID0gYiAvIDEwIHwgMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjW2pdID0gKGNbal0gKyBiKSAlIDEwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSW5jcmVtZW50IHJlc3VsdCBleHBvbmVudCBpZiB0aGVyZSBpcyBhIGZpbmFsIGNhcnJ5LlxyXG4gICAgICAgIGlmIChiKSB7XHJcbiAgICAgICAgICAgICsreS5lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIGFueSBsZWFkaW5nIHplcm8uXHJcbiAgICAgICAgaWYgKCFjWzBdKSB7XHJcbiAgICAgICAgICAgIGMuc2hpZnQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgICAgICBmb3IgKGkgPSBjLmxlbmd0aDsgIWNbLS1pXTsgYy5wb3AoKSkge1xyXG4gICAgICAgIH1cclxuICAgICAgICB5LmMgPSBjO1xyXG5cclxuICAgICAgICByZXR1cm4geTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZy5cclxuICAgICAqIFJldHVybiBleHBvbmVudGlhbCBub3RhdGlvbiBpZiB0aGlzIEJpZyBoYXMgYSBwb3NpdGl2ZSBleHBvbmVudCBlcXVhbCB0b1xyXG4gICAgICogb3IgZ3JlYXRlciB0aGFuIEJpZy5FX1BPUywgb3IgYSBuZWdhdGl2ZSBleHBvbmVudCBlcXVhbCB0byBvciBsZXNzIHRoYW5cclxuICAgICAqIEJpZy5FX05FRy5cclxuICAgICAqL1xyXG4gICAgUC50b1N0cmluZyA9IFAudmFsdWVPZiA9IFAudG9KU09OID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB4ID0gdGhpcyxcclxuICAgICAgICAgICAgQmlnID0geC5jb25zdHJ1Y3RvcixcclxuICAgICAgICAgICAgZSA9IHguZSxcclxuICAgICAgICAgICAgc3RyID0geC5jLmpvaW4oJycpLFxyXG4gICAgICAgICAgICBzdHJMID0gc3RyLmxlbmd0aDtcclxuXHJcbiAgICAgICAgLy8gRXhwb25lbnRpYWwgbm90YXRpb24/XHJcbiAgICAgICAgaWYgKGUgPD0gQmlnLkVfTkVHIHx8IGUgPj0gQmlnLkVfUE9TKSB7XHJcbiAgICAgICAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyAoc3RyTCA+IDEgPyAnLicgKyBzdHIuc2xpY2UoMSkgOiAnJykgK1xyXG4gICAgICAgICAgICAgIChlIDwgMCA/ICdlJyA6ICdlKycpICsgZTtcclxuXHJcbiAgICAgICAgLy8gTmVnYXRpdmUgZXhwb25lbnQ/XHJcbiAgICAgICAgfSBlbHNlIGlmIChlIDwgMCkge1xyXG5cclxuICAgICAgICAgICAgLy8gUHJlcGVuZCB6ZXJvcy5cclxuICAgICAgICAgICAgZm9yICg7ICsrZTsgc3RyID0gJzAnICsgc3RyKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RyID0gJzAuJyArIHN0cjtcclxuXHJcbiAgICAgICAgLy8gUG9zaXRpdmUgZXhwb25lbnQ/XHJcbiAgICAgICAgfSBlbHNlIGlmIChlID4gMCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCsrZSA+IHN0ckwpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBcHBlbmQgemVyb3MuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGUgLT0gc3RyTDsgZS0tIDsgc3RyICs9ICcwJykge1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGUgPCBzdHJMKSB7XHJcbiAgICAgICAgICAgICAgICBzdHIgPSBzdHIuc2xpY2UoMCwgZSkgKyAnLicgKyBzdHIuc2xpY2UoZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRXhwb25lbnQgemVyby5cclxuICAgICAgICB9IGVsc2UgaWYgKHN0ckwgPiAxKSB7XHJcbiAgICAgICAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyAnLicgKyBzdHIuc2xpY2UoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBdm9pZCAnLTAnXHJcbiAgICAgICAgcmV0dXJuIHgucyA8IDAgJiYgeC5jWzBdID8gJy0nICsgc3RyIDogc3RyO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAqIElmIHRvRXhwb25lbnRpYWwsIHRvRml4ZWQsIHRvUHJlY2lzaW9uIGFuZCBmb3JtYXQgYXJlIG5vdCByZXF1aXJlZCB0aGV5XHJcbiAgICAgKiBjYW4gc2FmZWx5IGJlIGNvbW1lbnRlZC1vdXQgb3IgZGVsZXRlZC4gTm8gcmVkdW5kYW50IGNvZGUgd2lsbCBiZSBsZWZ0LlxyXG4gICAgICogZm9ybWF0IGlzIHVzZWQgb25seSBieSB0b0V4cG9uZW50aWFsLCB0b0ZpeGVkIGFuZCB0b1ByZWNpc2lvbi5cclxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAqL1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgaW4gZXhwb25lbnRpYWxcclxuICAgICAqIG5vdGF0aW9uIHRvIGRwIGZpeGVkIGRlY2ltYWwgcGxhY2VzIGFuZCByb3VuZGVkLCBpZiBuZWNlc3NhcnksIHVzaW5nXHJcbiAgICAgKiBCaWcuUk0uXHJcbiAgICAgKlxyXG4gICAgICogW2RwXSB7bnVtYmVyfSBJbnRlZ2VyLCAwIHRvIE1BWF9EUCBpbmNsdXNpdmUuXHJcbiAgICAgKi9cclxuICAgIFAudG9FeHBvbmVudGlhbCA9IGZ1bmN0aW9uIChkcCkge1xyXG5cclxuICAgICAgICBpZiAoZHAgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBkcCA9IHRoaXMuYy5sZW5ndGggLSAxO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZHAgIT09IH5+ZHAgfHwgZHAgPCAwIHx8IGRwID4gTUFYX0RQKSB7XHJcbiAgICAgICAgICAgIHRocm93RXJyKCchdG9FeHAhJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZm9ybWF0KHRoaXMsIGRwLCAxKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBpbiBub3JtYWwgbm90YXRpb25cclxuICAgICAqIHRvIGRwIGZpeGVkIGRlY2ltYWwgcGxhY2VzIGFuZCByb3VuZGVkLCBpZiBuZWNlc3NhcnksIHVzaW5nIEJpZy5STS5cclxuICAgICAqXHJcbiAgICAgKiBbZHBdIHtudW1iZXJ9IEludGVnZXIsIDAgdG8gTUFYX0RQIGluY2x1c2l2ZS5cclxuICAgICAqL1xyXG4gICAgUC50b0ZpeGVkID0gZnVuY3Rpb24gKGRwKSB7XHJcbiAgICAgICAgdmFyIHN0cixcclxuICAgICAgICAgICAgeCA9IHRoaXMsXHJcbiAgICAgICAgICAgIEJpZyA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgICAgICAgIG5lZyA9IEJpZy5FX05FRyxcclxuICAgICAgICAgICAgcG9zID0gQmlnLkVfUE9TO1xyXG5cclxuICAgICAgICAvLyBQcmV2ZW50IHRoZSBwb3NzaWJpbGl0eSBvZiBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICAgICAgICBCaWcuRV9ORUcgPSAtKEJpZy5FX1BPUyA9IDEgLyAwKTtcclxuXHJcbiAgICAgICAgaWYgKGRwID09IG51bGwpIHtcclxuICAgICAgICAgICAgc3RyID0geC50b1N0cmluZygpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZHAgPT09IH5+ZHAgJiYgZHAgPj0gMCAmJiBkcCA8PSBNQVhfRFApIHtcclxuICAgICAgICAgICAgc3RyID0gZm9ybWF0KHgsIHguZSArIGRwKTtcclxuXHJcbiAgICAgICAgICAgIC8vICgtMCkudG9GaXhlZCgpIGlzICcwJywgYnV0ICgtMC4xKS50b0ZpeGVkKCkgaXMgJy0wJy5cclxuICAgICAgICAgICAgLy8gKC0wKS50b0ZpeGVkKDEpIGlzICcwLjAnLCBidXQgKC0wLjAxKS50b0ZpeGVkKDEpIGlzICctMC4wJy5cclxuICAgICAgICAgICAgaWYgKHgucyA8IDAgJiYgeC5jWzBdICYmIHN0ci5pbmRleE9mKCctJykgPCAwKSB7XHJcbiAgICAgICAgLy9FLmcuIC0wLjUgaWYgcm91bmRlZCB0byAtMCB3aWxsIGNhdXNlIHRvU3RyaW5nIHRvIG9taXQgdGhlIG1pbnVzIHNpZ24uXHJcbiAgICAgICAgICAgICAgICBzdHIgPSAnLScgKyBzdHI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgQmlnLkVfTkVHID0gbmVnO1xyXG4gICAgICAgIEJpZy5FX1BPUyA9IHBvcztcclxuXHJcbiAgICAgICAgaWYgKCFzdHIpIHtcclxuICAgICAgICAgICAgdGhyb3dFcnIoJyF0b0ZpeCEnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdHI7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgcm91bmRlZCB0byBzZFxyXG4gICAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIEJpZy5STS4gVXNlIGV4cG9uZW50aWFsIG5vdGF0aW9uIGlmIHNkIGlzIGxlc3NcclxuICAgICAqIHRoYW4gdGhlIG51bWJlciBvZiBkaWdpdHMgbmVjZXNzYXJ5IHRvIHJlcHJlc2VudCB0aGUgaW50ZWdlciBwYXJ0IG9mIHRoZVxyXG4gICAgICogdmFsdWUgaW4gbm9ybWFsIG5vdGF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIHNkIHtudW1iZXJ9IEludGVnZXIsIDEgdG8gTUFYX0RQIGluY2x1c2l2ZS5cclxuICAgICAqL1xyXG4gICAgUC50b1ByZWNpc2lvbiA9IGZ1bmN0aW9uIChzZCkge1xyXG5cclxuICAgICAgICBpZiAoc2QgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc2QgIT09IH5+c2QgfHwgc2QgPCAxIHx8IHNkID4gTUFYX0RQKSB7XHJcbiAgICAgICAgICAgIHRocm93RXJyKCchdG9QcmUhJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZm9ybWF0KHRoaXMsIHNkIC0gMSwgMik7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBFeHBvcnRcclxuXHJcblxyXG4gICAgQmlnID0gYmlnRmFjdG9yeSgpO1xyXG5cclxuICAgIC8vQU1ELlxyXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaWc7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgLy8gTm9kZSBhbmQgb3RoZXIgQ29tbW9uSlMtbGlrZSBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLlxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gQmlnO1xyXG5cclxuICAgIC8vQnJvd3Nlci5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZ2xvYmFsLkJpZyA9IEJpZztcclxuICAgIH1cclxufSkodGhpcyk7XHJcbiIsIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cbid1c2Ugc3RyaWN0J1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gU2xvd0J1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKG1vc3QgY29tcGF0aWJsZSwgZXZlbiBJRTYpXG4gKlxuICogQnJvd3NlcnMgdGhhdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLCBDaHJvbWUgNyssIFNhZmFyaSA1LjErLFxuICogT3BlcmEgMTEuNissIGlPUyA0LjIrLlxuICpcbiAqIER1ZSB0byB2YXJpb3VzIGJyb3dzZXIgYnVncywgc29tZXRpbWVzIHRoZSBPYmplY3QgaW1wbGVtZW50YXRpb24gd2lsbCBiZSB1c2VkIGV2ZW5cbiAqIHdoZW4gdGhlIGJyb3dzZXIgc3VwcG9ydHMgdHlwZWQgYXJyYXlzLlxuICpcbiAqIE5vdGU6XG4gKlxuICogICAtIEZpcmVmb3ggNC0yOSBsYWNrcyBzdXBwb3J0IGZvciBhZGRpbmcgbmV3IHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcyxcbiAqICAgICBTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOC5cbiAqXG4gKiAgIC0gQ2hyb21lIDktMTAgaXMgbWlzc2luZyB0aGUgYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbi5cbiAqXG4gKiAgIC0gSUUxMCBoYXMgYSBicm9rZW4gYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGFycmF5cyBvZlxuICogICAgIGluY29ycmVjdCBsZW5ndGggaW4gc29tZSBzaXR1YXRpb25zLlxuXG4gKiBXZSBkZXRlY3QgdGhlc2UgYnVnZ3kgYnJvd3NlcnMgYW5kIHNldCBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgIHRvIGBmYWxzZWAgc28gdGhleVxuICogZ2V0IHRoZSBPYmplY3QgaW1wbGVtZW50YXRpb24sIHdoaWNoIGlzIHNsb3dlciBidXQgYmVoYXZlcyBjb3JyZWN0bHkuXG4gKi9cbkJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUID0gZ2xvYmFsLlRZUEVEX0FSUkFZX1NVUFBPUlQgIT09IHVuZGVmaW5lZFxuICA/IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gIDogdHlwZWRBcnJheVN1cHBvcnQoKVxuXG4vKlxuICogRXhwb3J0IGtNYXhMZW5ndGggYWZ0ZXIgdHlwZWQgYXJyYXkgc3VwcG9ydCBpcyBkZXRlcm1pbmVkLlxuICovXG5leHBvcnRzLmtNYXhMZW5ndGggPSBrTWF4TGVuZ3RoKClcblxuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIGFyci5mb28oKSA9PT0gNDIgJiYgLy8gdHlwZWQgYXJyYXkgaW5zdGFuY2VzIGNhbiBiZSBhdWdtZW50ZWRcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAmJiAvLyBjaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgICAgICAgYXJyLnN1YmFycmF5KDEsIDEpLmJ5dGVMZW5ndGggPT09IDAgLy8gaWUxMCBoYXMgYnJva2VuIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmZ1bmN0aW9uIGtNYXhMZW5ndGggKCkge1xuICByZXR1cm4gQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgICA/IDB4N2ZmZmZmZmZcbiAgICA6IDB4M2ZmZmZmZmZcbn1cblxuZnVuY3Rpb24gY3JlYXRlQnVmZmVyICh0aGF0LCBsZW5ndGgpIHtcbiAgaWYgKGtNYXhMZW5ndGgoKSA8IGxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHR5cGVkIGFycmF5IGxlbmd0aCcpXG4gIH1cbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UsIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgdGhhdCA9IG5ldyBVaW50OEFycmF5KGxlbmd0aClcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgaWYgKHRoYXQgPT09IG51bGwpIHtcbiAgICAgIHRoYXQgPSBuZXcgQnVmZmVyKGxlbmd0aClcbiAgICB9XG4gICAgdGhhdC5sZW5ndGggPSBsZW5ndGhcbiAgfVxuXG4gIHJldHVybiB0aGF0XG59XG5cbi8qKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBoYXZlIHRoZWlyXG4gKiBwcm90b3R5cGUgY2hhbmdlZCB0byBgQnVmZmVyLnByb3RvdHlwZWAuIEZ1cnRoZXJtb3JlLCBgQnVmZmVyYCBpcyBhIHN1YmNsYXNzIG9mXG4gKiBgVWludDhBcnJheWAsIHNvIHRoZSByZXR1cm5lZCBpbnN0YW5jZXMgd2lsbCBoYXZlIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBtZXRob2RzXG4gKiBhbmQgdGhlIGBVaW50OEFycmF5YCBtZXRob2RzLiBTcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdFxuICogcmV0dXJucyBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBUaGUgYFVpbnQ4QXJyYXlgIHByb3RvdHlwZSByZW1haW5zIHVubW9kaWZpZWQuXG4gKi9cblxuZnVuY3Rpb24gQnVmZmVyIChhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmICEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIC8vIENvbW1vbiBjYXNlLlxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdJZiBlbmNvZGluZyBpcyBzcGVjaWZpZWQgdGhlbiB0aGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZydcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIGFsbG9jVW5zYWZlKHRoaXMsIGFyZylcbiAgfVxuICByZXR1cm4gZnJvbSh0aGlzLCBhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnBvb2xTaXplID0gODE5MiAvLyBub3QgdXNlZCBieSB0aGlzIGltcGxlbWVudGF0aW9uXG5cbi8vIFRPRE86IExlZ2FjeSwgbm90IG5lZWRlZCBhbnltb3JlLiBSZW1vdmUgaW4gbmV4dCBtYWpvciB2ZXJzaW9uLlxuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIGZyb20gKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKVxuICB9XG5cbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZyb21TdHJpbmcodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQpXG4gIH1cblxuICByZXR1cm4gZnJvbU9iamVjdCh0aGF0LCB2YWx1ZSlcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsbHkgZXF1aXZhbGVudCB0byBCdWZmZXIoYXJnLCBlbmNvZGluZykgYnV0IHRocm93cyBhIFR5cGVFcnJvclxuICogaWYgdmFsdWUgaXMgYSBudW1iZXIuXG4gKiBCdWZmZXIuZnJvbShzdHJbLCBlbmNvZGluZ10pXG4gKiBCdWZmZXIuZnJvbShhcnJheSlcbiAqIEJ1ZmZlci5mcm9tKGJ1ZmZlcilcbiAqIEJ1ZmZlci5mcm9tKGFycmF5QnVmZmVyWywgYnl0ZU9mZnNldFssIGxlbmd0aF1dKVxuICoqL1xuQnVmZmVyLmZyb20gPSBmdW5jdGlvbiAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gZnJvbShudWxsLCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5pZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgQnVmZmVyLnByb3RvdHlwZS5fX3Byb3RvX18gPSBVaW50OEFycmF5LnByb3RvdHlwZVxuICBCdWZmZXIuX19wcm90b19fID0gVWludDhBcnJheVxuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnNwZWNpZXMgJiZcbiAgICAgIEJ1ZmZlcltTeW1ib2wuc3BlY2llc10gPT09IEJ1ZmZlcikge1xuICAgIC8vIEZpeCBzdWJhcnJheSgpIGluIEVTMjAxNi4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzk3XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlciwgU3ltYm9sLnNwZWNpZXMsIHtcbiAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnRTaXplIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyJylcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvYyAodGhhdCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxuICB9XG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHBheSBhdHRlbnRpb24gdG8gZW5jb2RpbmcgaWYgaXQncyBhIHN0cmluZy4gVGhpc1xuICAgIC8vIHByZXZlbnRzIGFjY2lkZW50YWxseSBzZW5kaW5nIGluIGEgbnVtYmVyIHRoYXQgd291bGRcbiAgICAvLyBiZSBpbnRlcnByZXR0ZWQgYXMgYSBzdGFydCBvZmZzZXQuXG4gICAgcmV0dXJuIHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZydcbiAgICAgID8gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgICA6IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKS5maWxsKGZpbGwpXG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqIGFsbG9jKHNpemVbLCBmaWxsWywgZW5jb2RpbmddXSlcbiAqKi9cbkJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICByZXR1cm4gYWxsb2MobnVsbCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpXG59XG5cbmZ1bmN0aW9uIGFsbG9jVW5zYWZlICh0aGF0LCBzaXplKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplIDwgMCA/IDAgOiBjaGVja2VkKHNpemUpIHwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICB0aGF0W2ldID0gMFxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gQnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gU2xvd0J1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICovXG5CdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG5cbmZ1bmN0aW9uIGZyb21TdHJpbmcgKHRoYXQsIHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycgfHwgZW5jb2RpbmcgPT09ICcnKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgfVxuXG4gIGlmICghQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJlbmNvZGluZ1wiIG11c3QgYmUgYSB2YWxpZCBzdHJpbmcgZW5jb2RpbmcnKVxuICB9XG5cbiAgdmFyIGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuXG4gIHRoYXQud3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5TGlrZSAodGhhdCwgYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBsZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICB0aGF0W2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlCdWZmZXIgKHRoYXQsIGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgYXJyYXkuYnl0ZUxlbmd0aCAvLyB0aGlzIHRocm93cyBpZiBgYXJyYXlgIGlzIG5vdCBhIHZhbGlkIEFycmF5QnVmZmVyXG5cbiAgaWYgKGJ5dGVPZmZzZXQgPCAwIHx8IGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0KSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1xcJ29mZnNldFxcJyBpcyBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGlmIChhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCArIChsZW5ndGggfHwgMCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXFwnbGVuZ3RoXFwnIGlzIG91dCBvZiBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldClcbiAgfSBlbHNlIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gYXJyYXlcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgdGhhdCA9IGZyb21BcnJheUxpa2UodGhhdCwgYXJyYXkpXG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAodGhhdCwgb2JqKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIob2JqKSkge1xuICAgIHZhciBsZW4gPSBjaGVja2VkKG9iai5sZW5ndGgpIHwgMFxuICAgIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuKVxuXG4gICAgaWYgKHRoYXQubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhhdFxuICAgIH1cblxuICAgIG9iai5jb3B5KHRoYXQsIDAsIDAsIGxlbilcbiAgICByZXR1cm4gdGhhdFxuICB9XG5cbiAgaWYgKG9iaikge1xuICAgIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICBvYmouYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHx8ICdsZW5ndGgnIGluIG9iaikge1xuICAgICAgaWYgKHR5cGVvZiBvYmoubGVuZ3RoICE9PSAnbnVtYmVyJyB8fCBpc25hbihvYmoubGVuZ3RoKSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlQnVmZmVyKHRoYXQsIDApXG4gICAgICB9XG4gICAgICByZXR1cm4gZnJvbUFycmF5TGlrZSh0aGF0LCBvYmopXG4gICAgfVxuXG4gICAgaWYgKG9iai50eXBlID09PSAnQnVmZmVyJyAmJiBpc0FycmF5KG9iai5kYXRhKSkge1xuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqLmRhdGEpXG4gICAgfVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksIG9yIGFycmF5LWxpa2Ugb2JqZWN0LicpXG59XG5cbmZ1bmN0aW9uIGNoZWNrZWQgKGxlbmd0aCkge1xuICAvLyBOb3RlOiBjYW5ub3QgdXNlIGBsZW5ndGggPCBrTWF4TGVuZ3RoYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IGtNYXhMZW5ndGgoKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBrTWF4TGVuZ3RoKCkudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZnVuY3Rpb24gU2xvd0J1ZmZlciAobGVuZ3RoKSB7XG4gIGlmICgrbGVuZ3RoICE9IGxlbmd0aCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGVxZXFlcVxuICAgIGxlbmd0aCA9IDBcbiAgfVxuICByZXR1cm4gQnVmZmVyLmFsbG9jKCtsZW5ndGgpXG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyIChiKSB7XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihhKSB8fCAhQnVmZmVyLmlzQnVmZmVyKGIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIG11c3QgYmUgQnVmZmVycycpXG4gIH1cblxuICBpZiAoYSA9PT0gYikgcmV0dXJuIDBcblxuICB2YXIgeCA9IGEubGVuZ3RoXG4gIHZhciB5ID0gYi5sZW5ndGhcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICB4ID0gYVtpXVxuICAgICAgeSA9IGJbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIGlzRW5jb2RpbmcgKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gY29uY2F0IChsaXN0LCBsZW5ndGgpIHtcbiAgaWYgKCFpc0FycmF5KGxpc3QpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBCdWZmZXIuYWxsb2MoMClcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGxlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgbGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShsZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ1ZiA9IGxpc3RbaV1cbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nLmxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBBcnJheUJ1ZmZlci5pc1ZpZXcgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIChBcnJheUJ1ZmZlci5pc1ZpZXcoc3RyaW5nKSB8fCBzdHJpbmcgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikpIHtcbiAgICByZXR1cm4gc3RyaW5nLmJ5dGVMZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICBzdHJpbmcgPSAnJyArIHN0cmluZ1xuICB9XG5cbiAgdmFyIGxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKGxlbiA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBVc2UgYSBmb3IgbG9vcCB0byBhdm9pZCByZWN1cnNpb25cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAvLyBEZXByZWNhdGVkXG4gICAgICBjYXNlICdyYXcnOlxuICAgICAgY2FzZSAncmF3cyc6XG4gICAgICAgIHJldHVybiBsZW5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIGxlbiAqIDJcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBsZW4gPj4+IDFcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aCAvLyBhc3N1bWUgdXRmOFxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuQnVmZmVyLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5cbmZ1bmN0aW9uIHNsb3dUb1N0cmluZyAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcblxuICAvLyBObyBuZWVkIHRvIHZlcmlmeSB0aGF0IFwidGhpcy5sZW5ndGggPD0gTUFYX1VJTlQzMlwiIHNpbmNlIGl0J3MgYSByZWFkLW9ubHlcbiAgLy8gcHJvcGVydHkgb2YgYSB0eXBlZCBhcnJheS5cblxuICAvLyBUaGlzIGJlaGF2ZXMgbmVpdGhlciBsaWtlIFN0cmluZyBub3IgVWludDhBcnJheSBpbiB0aGF0IHdlIHNldCBzdGFydC9lbmRcbiAgLy8gdG8gdGhlaXIgdXBwZXIvbG93ZXIgYm91bmRzIGlmIHRoZSB2YWx1ZSBwYXNzZWQgaXMgb3V0IG9mIHJhbmdlLlxuICAvLyB1bmRlZmluZWQgaXMgaGFuZGxlZCBzcGVjaWFsbHkgYXMgcGVyIEVDTUEtMjYyIDZ0aCBFZGl0aW9uLFxuICAvLyBTZWN0aW9uIDEzLjMuMy43IFJ1bnRpbWUgU2VtYW50aWNzOiBLZXllZEJpbmRpbmdJbml0aWFsaXphdGlvbi5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQgfHwgc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgLy8gUmV0dXJuIGVhcmx5IGlmIHN0YXJ0ID4gdGhpcy5sZW5ndGguIERvbmUgaGVyZSB0byBwcmV2ZW50IHBvdGVudGlhbCB1aW50MzJcbiAgLy8gY29lcmNpb24gZmFpbCBiZWxvdy5cbiAgaWYgKHN0YXJ0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCB8fCBlbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoZW5kIDw9IDApIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIC8vIEZvcmNlIGNvZXJzaW9uIHRvIHVpbnQzMi4gVGhpcyB3aWxsIGFsc28gY29lcmNlIGZhbHNleS9OYU4gdmFsdWVzIHRvIDAuXG4gIGVuZCA+Pj49IDBcbiAgc3RhcnQgPj4+PSAwXG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBiaW5hcnlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gVGhlIHByb3BlcnR5IGlzIHVzZWQgYnkgYEJ1ZmZlci5pc0J1ZmZlcmAgYW5kIGBpcy1idWZmZXJgIChpbiBTYWZhcmkgNS03KSB0byBkZXRlY3Rcbi8vIEJ1ZmZlciBpbnN0YW5jZXMuXG5CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblxuZnVuY3Rpb24gc3dhcCAoYiwgbiwgbSkge1xuICB2YXIgaSA9IGJbbl1cbiAgYltuXSA9IGJbbV1cbiAgYlttXSA9IGlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMTYgPSBmdW5jdGlvbiBzd2FwMTYgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDIgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDE2LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAxKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDMyID0gZnVuY3Rpb24gc3dhcDMyICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA0ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAzMi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgMilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGggfCAwXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiAnJ1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCAwLCBsZW5ndGgpXG4gIHJldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAoYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYikgPT09IDBcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gIHZhciBzdHIgPSAnJ1xuICB2YXIgbWF4ID0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFU1xuICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5tYXRjaCgvLnsyfS9nKS5qb2luKCcgJylcbiAgICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICB9XG5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSB0YXJnZXQgPyB0YXJnZXQubGVuZ3RoIDogMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNTdGFydCA9IDBcbiAgfVxuICBpZiAodGhpc0VuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc0VuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IGVuZCA+IHRhcmdldC5sZW5ndGggfHwgdGhpc1N0YXJ0IDwgMCB8fCB0aGlzRW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCAmJiBzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCkge1xuICAgIHJldHVybiAtMVxuICB9XG4gIGlmIChzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgc3RhcnQgPj4+PSAwXG4gIGVuZCA+Pj49IDBcbiAgdGhpc1N0YXJ0ID4+Pj0gMFxuICB0aGlzRW5kID4+Pj0gMFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQpIHJldHVybiAwXG5cbiAgdmFyIHggPSB0aGlzRW5kIC0gdGhpc1N0YXJ0XG4gIHZhciB5ID0gZW5kIC0gc3RhcnRcbiAgdmFyIGxlbiA9IE1hdGgubWluKHgsIHkpXG5cbiAgdmFyIHRoaXNDb3B5ID0gdGhpcy5zbGljZSh0aGlzU3RhcnQsIHRoaXNFbmQpXG4gIHZhciB0YXJnZXRDb3B5ID0gdGFyZ2V0LnNsaWNlKHN0YXJ0LCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIGlmICh0aGlzQ29weVtpXSAhPT0gdGFyZ2V0Q29weVtpXSkge1xuICAgICAgeCA9IHRoaXNDb3B5W2ldXG4gICAgICB5ID0gdGFyZ2V0Q29weVtpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGFycmF5SW5kZXhPZiAoYXJyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHZhciBpbmRleFNpemUgPSAxXG4gIHZhciBhcnJMZW5ndGggPSBhcnIubGVuZ3RoXG4gIHZhciB2YWxMZW5ndGggPSB2YWwubGVuZ3RoXG5cbiAgaWYgKGVuY29kaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgIGlmIChlbmNvZGluZyA9PT0gJ3VjczInIHx8IGVuY29kaW5nID09PSAndWNzLTInIHx8XG4gICAgICAgIGVuY29kaW5nID09PSAndXRmMTZsZScgfHwgZW5jb2RpbmcgPT09ICd1dGYtMTZsZScpIHtcbiAgICAgIGlmIChhcnIubGVuZ3RoIDwgMiB8fCB2YWwubGVuZ3RoIDwgMikge1xuICAgICAgICByZXR1cm4gLTFcbiAgICAgIH1cbiAgICAgIGluZGV4U2l6ZSA9IDJcbiAgICAgIGFyckxlbmd0aCAvPSAyXG4gICAgICB2YWxMZW5ndGggLz0gMlxuICAgICAgYnl0ZU9mZnNldCAvPSAyXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZCAoYnVmLCBpKSB7XG4gICAgaWYgKGluZGV4U2l6ZSA9PT0gMSkge1xuICAgICAgcmV0dXJuIGJ1ZltpXVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYnVmLnJlYWRVSW50MTZCRShpICogaW5kZXhTaXplKVxuICAgIH1cbiAgfVxuXG4gIHZhciBmb3VuZEluZGV4ID0gLTFcbiAgZm9yICh2YXIgaSA9IDA7IGJ5dGVPZmZzZXQgKyBpIDwgYXJyTGVuZ3RoOyBpKyspIHtcbiAgICBpZiAocmVhZChhcnIsIGJ5dGVPZmZzZXQgKyBpKSA9PT0gcmVhZCh2YWwsIGZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4KSkge1xuICAgICAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSBmb3VuZEluZGV4ID0gaVxuICAgICAgaWYgKGkgLSBmb3VuZEluZGV4ICsgMSA9PT0gdmFsTGVuZ3RoKSByZXR1cm4gKGJ5dGVPZmZzZXQgKyBmb3VuZEluZGV4KSAqIGluZGV4U2l6ZVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZm91bmRJbmRleCAhPT0gLTEpIGkgLT0gaSAtIGZvdW5kSW5kZXhcbiAgICAgIGZvdW5kSW5kZXggPSAtMVxuICAgIH1cbiAgfVxuICByZXR1cm4gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gaW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIGJ5dGVPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBieXRlT2Zmc2V0XG4gICAgYnl0ZU9mZnNldCA9IDBcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0ID4gMHg3ZmZmZmZmZikge1xuICAgIGJ5dGVPZmZzZXQgPSAweDdmZmZmZmZmXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IC0weDgwMDAwMDAwKSB7XG4gICAgYnl0ZU9mZnNldCA9IC0weDgwMDAwMDAwXG4gIH1cbiAgYnl0ZU9mZnNldCA+Pj0gMFxuXG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xXG4gIGlmIChieXRlT2Zmc2V0ID49IHRoaXMubGVuZ3RoKSByZXR1cm4gLTFcblxuICAvLyBOZWdhdGl2ZSBvZmZzZXRzIHN0YXJ0IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyXG4gIGlmIChieXRlT2Zmc2V0IDwgMCkgYnl0ZU9mZnNldCA9IE1hdGgubWF4KHRoaXMubGVuZ3RoICsgYnl0ZU9mZnNldCwgMClcblxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWwgPSBCdWZmZXIuZnJvbSh2YWwsIGVuY29kaW5nKVxuICB9XG5cbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcih2YWwpKSB7XG4gICAgLy8gc3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcvYnVmZmVyIGFsd2F5cyBmYWlsc1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKVxuICB9XG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKHRoaXMsIHZhbCwgYnl0ZU9mZnNldClcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZih0aGlzLCBbIHZhbCBdLCBieXRlT2Zmc2V0LCBlbmNvZGluZylcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlcicpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gdGhpcy5pbmRleE9mKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpICE9PSAtMVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChzdHJMZW4gJSAyICE9PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKGlzTmFOKHBhcnNlZCkpIHJldHVybiBpXG4gICAgYnVmW29mZnNldCArIGldID0gcGFyc2VkXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiaW5hcnlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBhc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHVjczJXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZSAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZylcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBvZmZzZXRbLCBsZW5ndGhdWywgZW5jb2RpbmddKVxuICB9IGVsc2UgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aCB8IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICAvLyBsZWdhY3kgd3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpIC0gcmVtb3ZlIGluIHYwLjEzXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0J1ZmZlci53cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXRbLCBsZW5ndGhdKSBpcyBubyBsb25nZXIgc3VwcG9ydGVkJ1xuICAgIClcbiAgfVxuXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbGVuZ3RoID4gcmVtYWluaW5nKSBsZW5ndGggPSByZW1haW5pbmdcblxuICBpZiAoKHN0cmluZy5sZW5ndGggPiAwICYmIChsZW5ndGggPCAwIHx8IG9mZnNldCA8IDApKSB8fCBvZmZzZXQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIHdyaXRlIG91dHNpZGUgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gYmluYXJ5V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgLy8gV2FybmluZzogbWF4TGVuZ3RoIG5vdCB0YWtlbiBpbnRvIGFjY291bnQgaW4gYmFzZTY0V3JpdGVcbiAgICAgICAgcmV0dXJuIGJhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1Y3MyV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG5mdW5jdGlvbiBiYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuICB2YXIgcmVzID0gW11cblxuICB2YXIgaSA9IHN0YXJ0XG4gIHdoaWxlIChpIDwgZW5kKSB7XG4gICAgdmFyIGZpcnN0Qnl0ZSA9IGJ1ZltpXVxuICAgIHZhciBjb2RlUG9pbnQgPSBudWxsXG4gICAgdmFyIGJ5dGVzUGVyU2VxdWVuY2UgPSAoZmlyc3RCeXRlID4gMHhFRikgPyA0XG4gICAgICA6IChmaXJzdEJ5dGUgPiAweERGKSA/IDNcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4QkYpID8gMlxuICAgICAgOiAxXG5cbiAgICBpZiAoaSArIGJ5dGVzUGVyU2VxdWVuY2UgPD0gZW5kKSB7XG4gICAgICB2YXIgc2Vjb25kQnl0ZSwgdGhpcmRCeXRlLCBmb3VydGhCeXRlLCB0ZW1wQ29kZVBvaW50XG5cbiAgICAgIHN3aXRjaCAoYnl0ZXNQZXJTZXF1ZW5jZSkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgaWYgKGZpcnN0Qnl0ZSA8IDB4ODApIHtcbiAgICAgICAgICAgIGNvZGVQb2ludCA9IGZpcnN0Qnl0ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweDFGKSA8PCAweDYgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0YpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHhDIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAodGhpcmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3RkYgJiYgKHRlbXBDb2RlUG9pbnQgPCAweEQ4MDAgfHwgdGVtcENvZGVQb2ludCA+IDB4REZGRikpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgZm91cnRoQnl0ZSA9IGJ1ZltpICsgM11cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKGZvdXJ0aEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4MTIgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4QyB8ICh0aGlyZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAoZm91cnRoQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4RkZGRiAmJiB0ZW1wQ29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29kZVBvaW50ID09PSBudWxsKSB7XG4gICAgICAvLyB3ZSBkaWQgbm90IGdlbmVyYXRlIGEgdmFsaWQgY29kZVBvaW50IHNvIGluc2VydCBhXG4gICAgICAvLyByZXBsYWNlbWVudCBjaGFyIChVK0ZGRkQpIGFuZCBhZHZhbmNlIG9ubHkgMSBieXRlXG4gICAgICBjb2RlUG9pbnQgPSAweEZGRkRcbiAgICAgIGJ5dGVzUGVyU2VxdWVuY2UgPSAxXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPiAweEZGRkYpIHtcbiAgICAgIC8vIGVuY29kZSB0byB1dGYxNiAoc3Vycm9nYXRlIHBhaXIgZGFuY2UpXG4gICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMFxuICAgICAgcmVzLnB1c2goY29kZVBvaW50ID4+PiAxMCAmIDB4M0ZGIHwgMHhEODAwKVxuICAgICAgY29kZVBvaW50ID0gMHhEQzAwIHwgY29kZVBvaW50ICYgMHgzRkZcbiAgICB9XG5cbiAgICByZXMucHVzaChjb2RlUG9pbnQpXG4gICAgaSArPSBieXRlc1BlclNlcXVlbmNlXG4gIH1cblxuICByZXR1cm4gZGVjb2RlQ29kZVBvaW50c0FycmF5KHJlcylcbn1cblxuLy8gQmFzZWQgb24gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjI3NDcyNzIvNjgwNzQyLCB0aGUgYnJvd3NlciB3aXRoXG4vLyB0aGUgbG93ZXN0IGxpbWl0IGlzIENocm9tZSwgd2l0aCAweDEwMDAwIGFyZ3MuXG4vLyBXZSBnbyAxIG1hZ25pdHVkZSBsZXNzLCBmb3Igc2FmZXR5XG52YXIgTUFYX0FSR1VNRU5UU19MRU5HVEggPSAweDEwMDBcblxuZnVuY3Rpb24gZGVjb2RlQ29kZVBvaW50c0FycmF5IChjb2RlUG9pbnRzKSB7XG4gIHZhciBsZW4gPSBjb2RlUG9pbnRzLmxlbmd0aFxuICBpZiAobGVuIDw9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjb2RlUG9pbnRzKSAvLyBhdm9pZCBleHRyYSBzbGljZSgpXG4gIH1cblxuICAvLyBEZWNvZGUgaW4gY2h1bmtzIHRvIGF2b2lkIFwiY2FsbCBzdGFjayBzaXplIGV4Y2VlZGVkXCIuXG4gIHZhciByZXMgPSAnJ1xuICB2YXIgaSA9IDBcbiAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcbiAgICAgIFN0cmluZyxcbiAgICAgIGNvZGVQb2ludHMuc2xpY2UoaSwgaSArPSBNQVhfQVJHVU1FTlRTX0xFTkdUSClcbiAgICApXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSAmIDB4N0YpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBiaW5hcnlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBoZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSArIDFdICogMjU2KVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIHNsaWNlIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IH5+c3RhcnRcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB+fmVuZFxuXG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCArPSBsZW5cbiAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgfSBlbHNlIGlmIChzdGFydCA+IGxlbikge1xuICAgIHN0YXJ0ID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5cbiAgICBpZiAoZW5kIDwgMCkgZW5kID0gMFxuICB9IGVsc2UgaWYgKGVuZCA+IGxlbikge1xuICAgIGVuZCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIHZhciBuZXdCdWZcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgbmV3QnVmID0gdGhpcy5zdWJhcnJheShzdGFydCwgZW5kKVxuICAgIG5ld0J1Zi5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgdmFyIHNsaWNlTGVuID0gZW5kIC0gc3RhcnRcbiAgICBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgaSsrKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3QnVmXG59XG5cbi8qXG4gKiBOZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGJ1ZmZlciBpc24ndCB0cnlpbmcgdG8gd3JpdGUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPZmZzZXQgKG9mZnNldCwgZXh0LCBsZW5ndGgpIHtcbiAgaWYgKChvZmZzZXQgJSAxKSAhPT0gMCB8fCBvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IGlzIG5vdCB1aW50JylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50TEUgPSBmdW5jdGlvbiByZWFkVUludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50QkUgPSBmdW5jdGlvbiByZWFkVUludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuICB9XG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXVxuICB2YXIgbXVsID0gMVxuICB3aGlsZSAoYnl0ZUxlbmd0aCA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gcmVhZFVJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiByZWFkVUludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDgpIHwgdGhpc1tvZmZzZXQgKyAxXVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAoKHRoaXNbb2Zmc2V0XSkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpKSArXG4gICAgICAodGhpc1tvZmZzZXQgKyAzXSAqIDB4MTAwMDAwMClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiByZWFkVUludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSAqIDB4MTAwMDAwMCkgK1xuICAgICgodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICB0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRMRSA9IGZ1bmN0aW9uIHJlYWRJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRCRSA9IGZ1bmN0aW9uIHJlYWRJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aFxuICB2YXIgbXVsID0gMVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWldXG4gIHdoaWxlIChpID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0taV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gcmVhZEludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgaWYgKCEodGhpc1tvZmZzZXRdICYgMHg4MCkpIHJldHVybiAodGhpc1tvZmZzZXRdKVxuICByZXR1cm4gKCgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiByZWFkSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAxXSB8ICh0aGlzW29mZnNldF0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gcmVhZEludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDNdIDw8IDI0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gcmVhZEludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCAyNCkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gcmVhZEZsb2F0TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gcmVhZEZsb2F0QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiByZWFkRG91YmxlTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDUyLCA4KVxufVxuXG5mdW5jdGlvbiBjaGVja0ludCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYnVmZmVyXCIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpXG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludExFID0gZnVuY3Rpb24gd3JpdGVVSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludEJFID0gZnVuY3Rpb24gd3JpdGVVSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiB3cml0ZVVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4ZmYsIDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludExFID0gZnVuY3Rpb24gd3JpdGVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGggLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpIC0gMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFID0gZnVuY3Rpb24gd3JpdGVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGggLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpICsgMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiB3cml0ZUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHg3ZiwgLTB4ODApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbmZ1bmN0aW9uIGNoZWNrSUVFRTc1NCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbiAgaWYgKG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5mdW5jdGlvbiB3cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDgsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG4gIHJldHVybiBvZmZzZXQgKyA4XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weSAodGFyZ2V0LCB0YXJnZXRTdGFydCwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0U3RhcnQgPj0gdGFyZ2V0Lmxlbmd0aCkgdGFyZ2V0U3RhcnQgPSB0YXJnZXQubGVuZ3RoXG4gIGlmICghdGFyZ2V0U3RhcnQpIHRhcmdldFN0YXJ0ID0gMFxuICBpZiAoZW5kID4gMCAmJiBlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVybiAwXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgaWYgKHRhcmdldFN0YXJ0IDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgfVxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChlbmQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0ICsgc3RhcnRcbiAgfVxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuICB2YXIgaVxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQgJiYgc3RhcnQgPCB0YXJnZXRTdGFydCAmJiB0YXJnZXRTdGFydCA8IGVuZCkge1xuICAgIC8vIGRlc2NlbmRpbmcgY29weSBmcm9tIGVuZFxuICAgIGZvciAoaSA9IGxlbiAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIGlmIChsZW4gPCAxMDAwIHx8ICFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIGFzY2VuZGluZyBjb3B5IGZyb20gc3RhcnRcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIFVpbnQ4QXJyYXkucHJvdG90eXBlLnNldC5jYWxsKFxuICAgICAgdGFyZ2V0LFxuICAgICAgdGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLFxuICAgICAgdGFyZ2V0U3RhcnRcbiAgICApXG4gIH1cblxuICByZXR1cm4gbGVuXG59XG5cbi8vIFVzYWdlOlxuLy8gICAgYnVmZmVyLmZpbGwobnVtYmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChidWZmZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKHN0cmluZ1ssIG9mZnNldFssIGVuZF1dWywgZW5jb2RpbmddKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCAodmFsLCBzdGFydCwgZW5kLCBlbmNvZGluZykge1xuICAvLyBIYW5kbGUgc3RyaW5nIGNhc2VzOlxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodHlwZW9mIHN0YXJ0ID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBzdGFydFxuICAgICAgc3RhcnQgPSAwXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVuZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gZW5kXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH1cbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIGNvZGUgPSB2YWwuY2hhckNvZGVBdCgwKVxuICAgICAgaWYgKGNvZGUgPCAyNTYpIHtcbiAgICAgICAgdmFsID0gY29kZVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycgJiYgIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDI1NVxuICB9XG5cbiAgLy8gSW52YWxpZCByYW5nZXMgYXJlIG5vdCBzZXQgdG8gYSBkZWZhdWx0LCBzbyBjYW4gcmFuZ2UgY2hlY2sgZWFybHkuXG4gIGlmIChzdGFydCA8IDAgfHwgdGhpcy5sZW5ndGggPCBzdGFydCB8fCB0aGlzLmxlbmd0aCA8IGVuZCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdPdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBzdGFydCA9IHN0YXJ0ID4+PiAwXG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gdGhpcy5sZW5ndGggOiBlbmQgPj4+IDBcblxuICBpZiAoIXZhbCkgdmFsID0gMFxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgIHRoaXNbaV0gPSB2YWxcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJ5dGVzID0gQnVmZmVyLmlzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IHV0ZjhUb0J5dGVzKG5ldyBCdWZmZXIodmFsLCBlbmNvZGluZykudG9TdHJpbmcoKSlcbiAgICB2YXIgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyBpKyspIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rXFwvMC05QS1aYS16LV9dL2dcblxuZnVuY3Rpb24gYmFzZTY0Y2xlYW4gKHN0cikge1xuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyaW5ndHJpbShzdHIpLnJlcGxhY2UoSU5WQUxJRF9CQVNFNjRfUkUsICcnKVxuICAvLyBOb2RlIGNvbnZlcnRzIHN0cmluZ3Mgd2l0aCBsZW5ndGggPCAyIHRvICcnXG4gIGlmIChzdHIubGVuZ3RoIDwgMikgcmV0dXJuICcnXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICB2YXIgY29kZVBvaW50XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBsZWFkU3Vycm9nYXRlID0gbnVsbFxuICB2YXIgYnl0ZXMgPSBbXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSAobGVhZFN1cnJvZ2F0ZSAtIDB4RDgwMCA8PCAxMCB8IGNvZGVQb2ludCAtIDB4REMwMCkgKyAweDEwMDAwXG4gICAgfSBlbHNlIGlmIChsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAvLyB2YWxpZCBibXAgY2hhciwgYnV0IGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICB9XG5cbiAgICBsZWFkU3Vycm9nYXRlID0gbnVsbFxuXG4gICAgLy8gZW5jb2RlIHV0ZjhcbiAgICBpZiAoY29kZVBvaW50IDwgMHg4MCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAxKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKGNvZGVQb2ludClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4ODAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgfCAweEMwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAzKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDIHwgMHhFMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gNCkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4MTIgfCAweEYwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBieXRlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuXG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoYmFzZTY0Y2xlYW4oc3RyKSlcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gaXNuYW4gKHZhbCkge1xuICByZXR1cm4gdmFsICE9PSB2YWwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zZWxmLWNvbXBhcmVcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG52YXIgaXNBcnJheSA9IGZ1bmN0aW9uIGlzQXJyYXkoYXJyKSB7XG5cdGlmICh0eXBlb2YgQXJyYXkuaXNBcnJheSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHJldHVybiBBcnJheS5pc0FycmF5KGFycik7XG5cdH1cblxuXHRyZXR1cm4gdG9TdHIuY2FsbChhcnIpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxudmFyIGlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuXHRpZiAoIW9iaiB8fCB0b1N0ci5jYWxsKG9iaikgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0dmFyIGhhc093bkNvbnN0cnVjdG9yID0gaGFzT3duLmNhbGwob2JqLCAnY29uc3RydWN0b3InKTtcblx0dmFyIGhhc0lzUHJvdG90eXBlT2YgPSBvYmouY29uc3RydWN0b3IgJiYgb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSAmJiBoYXNPd24uY2FsbChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCAnaXNQcm90b3R5cGVPZicpO1xuXHQvLyBOb3Qgb3duIGNvbnN0cnVjdG9yIHByb3BlcnR5IG11c3QgYmUgT2JqZWN0XG5cdGlmIChvYmouY29uc3RydWN0b3IgJiYgIWhhc093bkNvbnN0cnVjdG9yICYmICFoYXNJc1Byb3RvdHlwZU9mKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gT3duIHByb3BlcnRpZXMgYXJlIGVudW1lcmF0ZWQgZmlyc3RseSwgc28gdG8gc3BlZWQgdXAsXG5cdC8vIGlmIGxhc3Qgb25lIGlzIG93biwgdGhlbiBhbGwgcHJvcGVydGllcyBhcmUgb3duLlxuXHR2YXIga2V5O1xuXHRmb3IgKGtleSBpbiBvYmopIHsvKiovfVxuXG5cdHJldHVybiB0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJyB8fCBoYXNPd24uY2FsbChvYmosIGtleSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV4dGVuZCgpIHtcblx0dmFyIG9wdGlvbnMsIG5hbWUsIHNyYywgY29weSwgY29weUlzQXJyYXksIGNsb25lLFxuXHRcdHRhcmdldCA9IGFyZ3VtZW50c1swXSxcblx0XHRpID0gMSxcblx0XHRsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuXHRcdGRlZXAgPSBmYWxzZTtcblxuXHQvLyBIYW5kbGUgYSBkZWVwIGNvcHkgc2l0dWF0aW9uXG5cdGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnYm9vbGVhbicpIHtcblx0XHRkZWVwID0gdGFyZ2V0O1xuXHRcdHRhcmdldCA9IGFyZ3VtZW50c1sxXSB8fCB7fTtcblx0XHQvLyBza2lwIHRoZSBib29sZWFuIGFuZCB0aGUgdGFyZ2V0XG5cdFx0aSA9IDI7XG5cdH0gZWxzZSBpZiAoKHR5cGVvZiB0YXJnZXQgIT09ICdvYmplY3QnICYmIHR5cGVvZiB0YXJnZXQgIT09ICdmdW5jdGlvbicpIHx8IHRhcmdldCA9PSBudWxsKSB7XG5cdFx0dGFyZ2V0ID0ge307XG5cdH1cblxuXHRmb3IgKDsgaSA8IGxlbmd0aDsgKytpKSB7XG5cdFx0b3B0aW9ucyA9IGFyZ3VtZW50c1tpXTtcblx0XHQvLyBPbmx5IGRlYWwgd2l0aCBub24tbnVsbC91bmRlZmluZWQgdmFsdWVzXG5cdFx0aWYgKG9wdGlvbnMgIT0gbnVsbCkge1xuXHRcdFx0Ly8gRXh0ZW5kIHRoZSBiYXNlIG9iamVjdFxuXHRcdFx0Zm9yIChuYW1lIGluIG9wdGlvbnMpIHtcblx0XHRcdFx0c3JjID0gdGFyZ2V0W25hbWVdO1xuXHRcdFx0XHRjb3B5ID0gb3B0aW9uc1tuYW1lXTtcblxuXHRcdFx0XHQvLyBQcmV2ZW50IG5ldmVyLWVuZGluZyBsb29wXG5cdFx0XHRcdGlmICh0YXJnZXQgIT09IGNvcHkpIHtcblx0XHRcdFx0XHQvLyBSZWN1cnNlIGlmIHdlJ3JlIG1lcmdpbmcgcGxhaW4gb2JqZWN0cyBvciBhcnJheXNcblx0XHRcdFx0XHRpZiAoZGVlcCAmJiBjb3B5ICYmIChpc1BsYWluT2JqZWN0KGNvcHkpIHx8IChjb3B5SXNBcnJheSA9IGlzQXJyYXkoY29weSkpKSkge1xuXHRcdFx0XHRcdFx0aWYgKGNvcHlJc0FycmF5KSB7XG5cdFx0XHRcdFx0XHRcdGNvcHlJc0FycmF5ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdGNsb25lID0gc3JjICYmIGlzQXJyYXkoc3JjKSA/IHNyYyA6IFtdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Y2xvbmUgPSBzcmMgJiYgaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIE5ldmVyIG1vdmUgb3JpZ2luYWwgb2JqZWN0cywgY2xvbmUgdGhlbVxuXHRcdFx0XHRcdFx0dGFyZ2V0W25hbWVdID0gZXh0ZW5kKGRlZXAsIGNsb25lLCBjb3B5KTtcblxuXHRcdFx0XHRcdC8vIERvbid0IGJyaW5nIGluIHVuZGVmaW5lZCB2YWx1ZXNcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBjb3B5ICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0dGFyZ2V0W25hbWVdID0gY29weTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBSZXR1cm4gdGhlIG1vZGlmaWVkIG9iamVjdFxuXHRyZXR1cm4gdGFyZ2V0O1xufTtcblxuIiwiZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gZSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IG0gKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAodmFsdWUgKiBjIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHRyeSB7XG4gICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGlzIG5vdCBkZWZpbmVkJyk7XG4gICAgfVxuICB9XG4gIHRyeSB7XG4gICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICB9IGNhdGNoIChlKSB7XG4gICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaXMgbm90IGRlZmluZWQnKTtcbiAgICB9XG4gIH1cbn0gKCkpXG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBjYWNoZWRTZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjYWNoZWRDbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChqYXBhbmVzZSkge1xuXHRqYXBhbmVzZS5rYXRha2FuYVJlZ2V4ID0gbmV3IFJlZ0V4cCgnKCcgKyAnWycgKyAnXFxcXHUzMGExLVxcXFx1MzBmNCcgKyAvLyDjgqHvvZ7jg7Rcblx0J1xcXFx1MzBmNy1cXFxcdTMwZmEnICsgLy8g44O3772e44O6XG5cdCdcXFxcdTMwZmQtXFxcXHUzMGZmJyArIC8vIOODve+9nuODv1xuXHQnXFxcXHUzMWYwLVxcXFx1MzFmZicgKyAvLyDjh7DvvZ7jh79cblx0J10nICsgJ3wnICsgJ1xcXFx1ZDg2OVxcXFx1ZGYwOFxcXFx1MzA5OScgKyAvLyDwqpyI44KZXG5cdCd8JyArICdcXFxcdWQ4NjlcXFxcdWRmMDgnICsgLy8g8KqciFxuXHQnfCcgKyAnXFxcXHVkODJjXFxcXHVkYzAwJyArIC8vIPCbgIBcblx0JyknLCAnZycpO1xuXG5cdGphcGFuZXNlLmhpcmFnYW5hUmVnZXggPSBuZXcgUmVnRXhwKCcoJyArICdbJyArICdcXFxcdTMwNDEtXFxcXHUzMDk0JyArIC8vIOOBge+9nuOClFxuXHQnXFxcXHUzMDlkLVxcXFx1MzA5ZicgKyAvLyDjgp3vvZ7jgp9cblx0J10nICsgJ3wnICsgJ1xcXFx1ZDgyY1xcXFx1ZGMwMScgKyAvLyDwm4CBXG5cdCcpJywgJ2cnKTtcblxuXHRqYXBhbmVzZS5zcGVjaWFsSGlyYWdhbml6YXRpb25UYWJsZSA9IHtcblx0XHQn44O/JzogJ+OBk+OBqCcsXG5cdFx0J/CqnIgnOiAn44Go44KCJyxcblx0XHQn8KqciOOCmSc6ICfjganjgoInLFxuXHRcdCfjg7cnOiAn44KP44KZJyxcblx0XHQn44O4JzogJ+OCkOOCmScsXG5cdFx0J+ODuSc6ICfjgpHjgpknLFxuXHRcdCfjg7onOiAn44KS44KZJyxcblx0XHQn8JuAgCc6ICfjgYgnLFxuXHRcdCfjh7AnOiAn44GPJyxcblx0XHQn44exJzogJ+OBlycsXG5cdFx0J+OHsic6ICfjgZknLFxuXHRcdCfjh7MnOiAn44GoJyxcblx0XHQn44e0JzogJ+OBrCcsXG5cdFx0J+OHtSc6ICfjga8nLFxuXHRcdCfjh7YnOiAn44GyJyxcblx0XHQn44e3JzogJ+OBtScsXG5cdFx0J+OHuCc6ICfjgbgnLFxuXHRcdCfjh7knOiAn44G7Jyxcblx0XHQn44e6JzogJ+OCgCcsXG5cdFx0J+OHuyc6ICfjgoknLFxuXHRcdCfjh7wnOiAn44KKJyxcblx0XHQn44e9JzogJ+OCiycsXG5cdFx0J+OHvic6ICfjgownLFxuXHRcdCfjh78nOiAn44KNJ1xuXHR9O1xuXG5cdGphcGFuZXNlLnNwZWNpYWxLYXRha2FuaXphdGlvblRhYmxlID0ge1xuXHRcdCfjgp8nOiAn44Oo44OqJyxcblx0XHQn8JuAgSc6ICfjgqgnXG5cdH07XG5cblx0dmFyIGNociA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XG5cdHZhciBvcmQgPSBmdW5jdGlvbiBvcmQoY2hhcikge1xuXHRcdHJldHVybiBjaGFyLmNoYXJDb2RlQXQoMCk7XG5cdH07XG5cblx0amFwYW5lc2UuaGlyYWdhbml6ZSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcblx0XHRyZXR1cm4gc3RyaW5nLnJlcGxhY2UoamFwYW5lc2Uua2F0YWthbmFSZWdleCwgZnVuY3Rpb24gKGthdGFrYW5hKSB7XG5cdFx0XHRpZiAoa2F0YWthbmEubWF0Y2goL15bXFx1MzBhMS1cXHUzMGY0XFx1MzBmZFxcdTMwZmVdJC8pKSB7XG5cdFx0XHRcdHJldHVybiBjaHIob3JkKGthdGFrYW5hKSAtIG9yZCgn44KhJykgKyBvcmQoJ+OBgScpKTtcblx0XHRcdH0gZWxzZSBpZiAoamFwYW5lc2Uuc3BlY2lhbEhpcmFnYW5pemF0aW9uVGFibGVba2F0YWthbmFdKSB7XG5cdFx0XHRcdHJldHVybiBqYXBhbmVzZS5zcGVjaWFsSGlyYWdhbml6YXRpb25UYWJsZVtrYXRha2FuYV07XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG5cblx0amFwYW5lc2Uua2F0YWthbml6ZSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcblx0XHRyZXR1cm4gc3RyaW5nLnJlcGxhY2UoamFwYW5lc2UuaGlyYWdhbmFSZWdleCwgZnVuY3Rpb24gKGhpcmFnYW5hKSB7XG5cdFx0XHRpZiAoaGlyYWdhbmEubWF0Y2goL15bXFx1MzA0MS1cXHUzMDk0XFx1MzA5ZFxcdTMwOWVdJC8pKSB7XG5cdFx0XHRcdHJldHVybiBjaHIob3JkKGhpcmFnYW5hKSAtIG9yZCgn44GBJykgKyBvcmQoJ+OCoScpKTtcblx0XHRcdH0gZWxzZSBpZiAoamFwYW5lc2Uuc3BlY2lhbEthdGFrYW5pemF0aW9uVGFibGVbaGlyYWdhbmFdKSB7XG5cdFx0XHRcdHJldHVybiBqYXBhbmVzZS5zcGVjaWFsS2F0YWthbml6YXRpb25UYWJsZVtoaXJhZ2FuYV07XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbnZhciBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQnKTtcbnZhciBCaWcgPSByZXF1aXJlKCdiaWcuanMnKTtcblxuLy8gR2V0IG50aCBiaXQgZnJvbSBidWZmZXJcbmZ1bmN0aW9uIGdldEJpdChidWZmZXIsIHBvc2l0aW9uKSB7XG5cdHZhciBieXRlSW5kZXggPSBNYXRoLmZsb29yKHBvc2l0aW9uIC8gOCk7XG5cdHZhciBieXRlID0gYnVmZmVyW2J5dGVJbmRleF0gfHwgMDtcblxuXHRyZXR1cm4gISEoYnl0ZSAmIDEgPDwgNyAtIHBvc2l0aW9uICUgOCk7XG59XG5cbi8vIEdldCBiaXRzIG9mIGJ1ZmZlciBmcm9tIGEgdG8gYlxuZnVuY3Rpb24gZ2V0Qml0cyhidWZmZXIsIGZyb20sIGxlbmd0aCkge1xuXHR2YXIgcmV0ID0gbmV3IEJpZygwKTtcblxuXHRmb3IgKHZhciBwdHIgPSBmcm9tOyBwdHIgPCBmcm9tICsgbGVuZ3RoOyBwdHIrKykge1xuXHRcdHJldCA9IHJldC50aW1lcygyKTtcblx0XHRpZiAoZ2V0Qml0KGJ1ZmZlciwgcHRyKSkge1xuXHRcdFx0cmV0ID0gcmV0LnBsdXMoMSk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHJldDtcbn1cblxuLy8gQ29tcGF0aWZ5IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSIGFuZCBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUlxudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xudmFyIE1JTl9TQUZFX0lOVEVHRVIgPSAtOTAwNzE5OTI1NDc0MDk5MTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoamFwYW5lc2UpIHtcblx0amFwYW5lc2UudHJhbnNjcmlwdGlvbkNvbmZpZ3MgPSB7XG5cdFx0J2RlZmF1bHQnOiB7XG5cdFx0XHRtaW51c1NpZ246ICfjg57jgqTjg4rjgrknLFxuXHRcdFx0ZGVjaW1hbFBvaW50OiAn44O7Jyxcblx0XHRcdGRpZ2l0czogJ2NvbW1vbicsXG5cdFx0XHR1bml0TmFtZXM6ICdqaW5rb2tpMycsXG5cdFx0XHRzcGVjaWFsVW5pdE5hbWVzOiAnbm9uZScsXG5cdFx0XHR0cnVuY2F0ZU9uZTogWyfljYEnLCAn55m+JywgJ+WNgycsICfmi74nLCAn5L2wJywgJ+mYoScsICfku58nXSxcblx0XHRcdHNtYWxsVW5pdE5hbWVzOiAnbm9uZSdcblx0XHR9LFxuXHRcdGZvcm1hbDoge1xuXHRcdFx0ZGlnaXRzOiAnZm9ybWFsJyxcblx0XHRcdHVuaXROYW1lczogJ2Zvcm1hbCcsXG5cdFx0XHRzcGVjaWFsVW5pdE5hbWVzOiAnY29tbW9uJyxcblx0XHRcdHNtYWxsVW5pdE5hbWVzOiAnY29tbW9uJ1xuXHRcdH0sXG5cdFx0dHJhZGl0aW9uYWw6IHtcblx0XHRcdGRpZ2l0czogJ3RyYWRpdGlvbmFsJyxcblx0XHRcdHNwZWNpYWxVbml0TmFtZXM6ICdmdWxsJyxcblx0XHRcdHNtYWxsVW5pdE5hbWVzOiAnZnVsbCdcblx0XHR9XG5cdH07XG5cblx0amFwYW5lc2UucHJlZGVmaW5lZWRUcmFuc2NyaXB0aW9uQ29uZmlncyA9IHtcblx0XHRkaWdpdHM6IHtcblx0XHRcdGFyYWJpYzoge1xuXHRcdFx0XHQwOiAnMCcsXG5cdFx0XHRcdDE6ICcxJyxcblx0XHRcdFx0MjogJzInLFxuXHRcdFx0XHQzOiAnMycsXG5cdFx0XHRcdDQ6ICc0Jyxcblx0XHRcdFx0NTogJzUnLFxuXHRcdFx0XHQ2OiAnNicsXG5cdFx0XHRcdDc6ICc3Jyxcblx0XHRcdFx0ODogJzgnLFxuXHRcdFx0XHQ5OiAnOSdcblx0XHRcdH0sXG5cdFx0XHRjb21tb246IHtcblx0XHRcdFx0MDogJ+OAhycsXG5cdFx0XHRcdDE6ICfkuIAnLFxuXHRcdFx0XHQyOiAn5LqMJyxcblx0XHRcdFx0MzogJ+S4iScsXG5cdFx0XHRcdDQ6ICflm5snLFxuXHRcdFx0XHQ1OiAn5LqUJyxcblx0XHRcdFx0NjogJ+WFrScsXG5cdFx0XHRcdDc6ICfkuIMnLFxuXHRcdFx0XHQ4OiAn5YWrJyxcblx0XHRcdFx0OTogJ+S5nSdcblx0XHRcdH0sXG5cdFx0XHRmb3JtYWw6IHtcblx0XHRcdFx0MDogJ+OAhycsXG5cdFx0XHRcdDE6ICflo7EnLFxuXHRcdFx0XHQyOiAn5byQJyxcblx0XHRcdFx0MzogJ+WPgicsXG5cdFx0XHRcdDQ6ICflm5snLFxuXHRcdFx0XHQ1OiAn5LqUJyxcblx0XHRcdFx0NjogJ+WFrScsXG5cdFx0XHRcdDc6ICfkuIMnLFxuXHRcdFx0XHQ4OiAn5YWrJyxcblx0XHRcdFx0OTogJ+S5nSdcblx0XHRcdH0sXG5cdFx0XHR0cmFkaXRpb25hbDoge1xuXHRcdFx0XHQwOiAn6Zu2Jyxcblx0XHRcdFx0MTogJ+WjsScsXG5cdFx0XHRcdDI6ICflvJAnLFxuXHRcdFx0XHQzOiAn5Y+CJyxcblx0XHRcdFx0NDogJ+iChicsXG5cdFx0XHRcdDU6ICfkvI0nLFxuXHRcdFx0XHQ2OiAn6Zm4Jyxcblx0XHRcdFx0NzogJ+afkicsXG5cdFx0XHRcdDg6ICfmjYwnLFxuXHRcdFx0XHQ5OiAn546WJ1xuXHRcdFx0fSxcblx0XHRcdHRyYWRpdGlvbmFsT2xkOiB7XG5cdFx0XHRcdDA6ICfpm7YnLFxuXHRcdFx0XHQxOiAn5aO5Jyxcblx0XHRcdFx0MjogJ+iysycsXG5cdFx0XHRcdDM6ICflj4MnLFxuXHRcdFx0XHQ0OiAn6IKGJyxcblx0XHRcdFx0NTogJ+S8jScsXG5cdFx0XHRcdDY6ICfpmbgnLFxuXHRcdFx0XHQ3OiAn5p+SJyxcblx0XHRcdFx0ODogJ+aNjCcsXG5cdFx0XHRcdDk6ICfnjpYnXG5cdFx0XHR9LFxuXHRcdFx0c2ltcGxpZmllZDoge1xuXHRcdFx0XHQwOiAn6Zu2Jyxcblx0XHRcdFx0MTogJ+WjuScsXG5cdFx0XHRcdDI6ICfotLAnLFxuXHRcdFx0XHQzOiAn5Y+BJyxcblx0XHRcdFx0NDogJ+iChicsXG5cdFx0XHRcdDU6ICfkvI0nLFxuXHRcdFx0XHQ2OiAn6ZmGJyxcblx0XHRcdFx0NzogJ+afkicsXG5cdFx0XHRcdDg6ICfmjYwnLFxuXHRcdFx0XHQ5OiAn546WJ1xuXHRcdFx0fSxcblx0XHRcdGNoaW5lc2VNaWxpdGFyeToge1xuXHRcdFx0XHQwOiAn5rSeJyxcblx0XHRcdFx0MTogJ+W5uicsXG5cdFx0XHRcdDI6ICfkuKQnLFxuXHRcdFx0XHQzOiAn5LiJJyxcblx0XHRcdFx0NDogJ+WIgCcsXG5cdFx0XHRcdDU6ICfkupQnLFxuXHRcdFx0XHQ2OiAn5YWtJyxcblx0XHRcdFx0NzogJ+aLkCcsXG5cdFx0XHRcdDg6ICflhasnLFxuXHRcdFx0XHQ5OiAn5Yu+J1xuXHRcdFx0fSxcblx0XHRcdHZpZXRuYW06IHtcblx0XHRcdFx0MDogJ+OAhycsXG5cdFx0XHRcdDE6ICfwoKygJyxcblx0XHRcdFx0MjogJ/CghKknLFxuXHRcdFx0XHQzOiAn8KCApycsXG5cdFx0XHRcdDQ6ICfwpoqaJyxcblx0XHRcdFx0NTogJ/CghLwnLFxuXHRcdFx0XHQ2OiAn8KaSuScsXG5cdFx0XHRcdDc6ICfwpomxJyxcblx0XHRcdFx0ODogJ/CglK0nLFxuXHRcdFx0XHQ5OiAn8KCDqSdcblx0XHRcdH1cblx0XHR9LFxuXHRcdHVuaXROYW1lczoge1xuXHRcdFx0amlua29raTE6IHtcblx0XHRcdFx0MTogJ+WNgScsXG5cdFx0XHRcdDI6ICfnmb4nLFxuXHRcdFx0XHQzOiAn5Y2DJyxcblx0XHRcdFx0NDogJ+S4hycsXG5cdFx0XHRcdDU6ICflhIQnLFxuXHRcdFx0XHQ2OiAn5YWGJyxcblx0XHRcdFx0NzogJ+S6rCcsXG5cdFx0XHRcdDg6ICflnpMnLFxuXHRcdFx0XHQ5OiAn8KWdsScsXG5cdFx0XHRcdDEwOiAn56mjJyxcblx0XHRcdFx0MTE6ICfmup0nLFxuXHRcdFx0XHQxMjogJ+a+lycsXG5cdFx0XHRcdDEzOiAn5q2jJyxcblx0XHRcdFx0MTQ6ICfovIknLFxuXHRcdFx0XHQxNTogJ+altScsXG5cdFx0XHRcdDIzOiAn5oGS5rKz5rKZJyxcblx0XHRcdFx0MzE6ICfpmL/lg6fnpYcnLFxuXHRcdFx0XHQzOTogJ+mCo+eUseS7licsXG5cdFx0XHRcdDQ3OiAn5LiN5Y+v5oCd6K2wJyxcblx0XHRcdFx0NTU6ICfnhKHph4/lpKfmlbAnLFxuXHRcdFx0XHRsaXQ6IDYzXG5cdFx0XHR9LFxuXHRcdFx0amlua29raTI6IHtcblx0XHRcdFx0MTogJ+WNgScsXG5cdFx0XHRcdDI6ICfnmb4nLFxuXHRcdFx0XHQzOiAn5Y2DJyxcblx0XHRcdFx0NDogJ+S4hycsXG5cdFx0XHRcdDg6ICflhIQnLFxuXHRcdFx0XHQxMjogJ+WFhicsXG5cdFx0XHRcdDE2OiAn5LqsJyxcblx0XHRcdFx0MjA6ICflnpMnLFxuXHRcdFx0XHQyNDogJ/ClnbEnLFxuXHRcdFx0XHQyODogJ+epoycsXG5cdFx0XHRcdDMyOiAn5rqdJyxcblx0XHRcdFx0MzY6ICfmvpcnLFxuXHRcdFx0XHQ0MDogJ+atoycsXG5cdFx0XHRcdDQ0OiAn6LyJJyxcblx0XHRcdFx0NDg6ICfmpbUnLFxuXHRcdFx0XHQ1NjogJ+aBkuays+aymScsXG5cdFx0XHRcdDY0OiAn6Zi/5YOn56WHJyxcblx0XHRcdFx0NzI6ICfpgqPnlLHku5YnLFxuXHRcdFx0XHQ4MDogJ+S4jeWPr+aAneitsCcsXG5cdFx0XHRcdDg4OiAn54Sh6YeP5aSn5pWwJyxcblx0XHRcdFx0bGl0OiA5NlxuXHRcdFx0fSxcblx0XHRcdGppbmtva2kzOiB7XG5cdFx0XHRcdDE6ICfljYEnLFxuXHRcdFx0XHQyOiAn55m+Jyxcblx0XHRcdFx0MzogJ+WNgycsXG5cdFx0XHRcdDQ6ICfkuIcnLFxuXHRcdFx0XHQ4OiAn5YSEJyxcblx0XHRcdFx0MTI6ICflhYYnLFxuXHRcdFx0XHQxNjogJ+S6rCcsXG5cdFx0XHRcdDIwOiAn5Z6TJyxcblx0XHRcdFx0MjQ6ICfwpZ2xJyxcblx0XHRcdFx0Mjg6ICfnqaMnLFxuXHRcdFx0XHQzMjogJ+a6nScsXG5cdFx0XHRcdDM2OiAn5r6XJyxcblx0XHRcdFx0NDA6ICfmraMnLFxuXHRcdFx0XHQ0NDogJ+i8iScsXG5cdFx0XHRcdDQ4OiAn5qW1Jyxcblx0XHRcdFx0NTI6ICfmgZLmsrPmspknLFxuXHRcdFx0XHQ1NjogJ+mYv+WDp+elhycsXG5cdFx0XHRcdDYwOiAn6YKj55Sx5LuWJyxcblx0XHRcdFx0NjQ6ICfkuI3lj6/mgJ3orbAnLFxuXHRcdFx0XHQ2ODogJ+eEoemHj+Wkp+aVsCcsXG5cdFx0XHRcdGxpdDogNzJcblx0XHRcdH0sXG5cdFx0XHRqb3N1OiB7XG5cdFx0XHRcdDE6ICfljYEnLFxuXHRcdFx0XHQyOiAn55m+Jyxcblx0XHRcdFx0MzogJ+WNgycsXG5cdFx0XHRcdDQ6ICfkuIcnLFxuXHRcdFx0XHQ4OiAn5YSEJyxcblx0XHRcdFx0MTY6ICflhYYnLFxuXHRcdFx0XHQzMjogJ+S6rCcsXG5cdFx0XHRcdDY0OiAn5Z6TJyxcblx0XHRcdFx0MTI4OiAn8KWdsScsXG5cdFx0XHRcdDI1NjogJ+epoycsXG5cdFx0XHRcdDUxMjogJ+a6nScsXG5cdFx0XHRcdDEwMjQ6ICfmvpcnLFxuXHRcdFx0XHQyMDQ4OiAn5q2jJyxcblx0XHRcdFx0NDA5NjogJ+i8iScsXG5cdFx0XHRcdDgxOTI6ICfmpbUnLFxuXHRcdFx0XHQxNjM4NDogJ+aBkuays+aymScsXG5cdFx0XHRcdDMyNzY4OiAn6Zi/5YOn56WHJyxcblx0XHRcdFx0NjU1MzY6ICfpgqPnlLHku5YnLFxuXHRcdFx0XHQxMzEwNzI6ICfkuI3lj6/mgJ3orbAnLFxuXHRcdFx0XHQyNjIxNDQ6ICfnhKHph4/lpKfmlbAnLFxuXHRcdFx0XHRsaXQ6IDUyNDI4OFxuXHRcdFx0fSxcblx0XHRcdGZvcm1hbDoge1xuXHRcdFx0XHQxOiAn5ou+Jyxcblx0XHRcdFx0MjogJ+eZvicsXG5cdFx0XHRcdDM6ICfljYMnLFxuXHRcdFx0XHQ0OiAn5LiHJyxcblx0XHRcdFx0ODogJ+WEhCcsXG5cdFx0XHRcdDEyOiAn5YWGJyxcblx0XHRcdFx0MTY6ICfkuqwnLFxuXHRcdFx0XHQyMDogJ+WekycsXG5cdFx0XHRcdDI0OiAn8KWdsScsXG5cdFx0XHRcdDI4OiAn56mjJyxcblx0XHRcdFx0MzI6ICfmup0nLFxuXHRcdFx0XHQzNjogJ+a+lycsXG5cdFx0XHRcdDQwOiAn5q2jJyxcblx0XHRcdFx0NDQ6ICfovIknLFxuXHRcdFx0XHQ0ODogJ+altScsXG5cdFx0XHRcdDUyOiAn5oGS5rKz5rKZJyxcblx0XHRcdFx0NTY6ICfpmL/lg6fnpYcnLFxuXHRcdFx0XHQ2MDogJ+mCo+eUseS7licsXG5cdFx0XHRcdDY0OiAn5LiN5Y+v5oCd6K2wJyxcblx0XHRcdFx0Njg6ICfnhKHph4/lpKfmlbAnLFxuXHRcdFx0XHRsaXQ6IDcyXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRzcGVjaWFsVW5pdE5hbWVzOiB7XG5cdFx0XHRub25lOiB7fSxcblx0XHRcdGNvbW1vbjoge1xuXHRcdFx0XHQyMDogJ+W7vycsXG5cdFx0XHRcdDMwOiAn5Y2FJ1xuXHRcdFx0fSxcblx0XHRcdGZ1bGw6IHtcblx0XHRcdFx0MjA6ICflu78nLFxuXHRcdFx0XHQzMDogJ+WNhScsXG5cdFx0XHRcdDQwOiAn5Y2MJyxcblx0XHRcdFx0MjAwOiAn55qVJ1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0c21hbGxVbml0TmFtZXM6IHtcblx0XHRcdG5vbmU6IHt9LFxuXHRcdFx0Y29tbW9uOiB7XG5cdFx0XHRcdDE6ICfliIYnLFxuXHRcdFx0XHQyOiAn5Y6YJyxcblx0XHRcdFx0MzogJ+avmycsXG5cdFx0XHRcdDQ6ICfns7gnXG5cdFx0XHR9LFxuXHRcdFx0d2FyaToge1xuXHRcdFx0XHQxOiAn5YmyJyxcblx0XHRcdFx0MjogJ+WIhicsXG5cdFx0XHRcdDM6ICfljpgnLFxuXHRcdFx0XHQ0OiAn5q+bJyxcblx0XHRcdFx0NTogJ+ezuCdcblx0XHRcdH0sXG5cdFx0XHRmdWxsOiB7XG5cdFx0XHRcdDE6ICfliIYnLFxuXHRcdFx0XHQyOiAn5Y6YJyxcblx0XHRcdFx0MzogJ+avmycsXG5cdFx0XHRcdDQ6ICfns7gnLFxuXHRcdFx0XHQ1OiAn5b+9Jyxcblx0XHRcdFx0NjogJ+W+ricsXG5cdFx0XHRcdDc6ICfnuYonLFxuXHRcdFx0XHQ4OiAn5rKZJyxcblx0XHRcdFx0OTogJ+WhtScsXG5cdFx0XHRcdDEwOiAn5Z+DJyxcblx0XHRcdFx0MTE6ICfmuLonLFxuXHRcdFx0XHQxMjogJ+a8oCcsXG5cdFx0XHRcdDEzOiAn5qih57OKJyxcblx0XHRcdFx0MTQ6ICfpgKHlt6EnLFxuXHRcdFx0XHQxNTogJ+mgiOiHvicsXG5cdFx0XHRcdDE2OiAn556s5oGvJyxcblx0XHRcdFx0MTc6ICflvL7mjIcnLFxuXHRcdFx0XHQxODogJ+WIuemCoycsXG5cdFx0XHRcdDE5OiAn5YWt5b6zJyxcblx0XHRcdFx0MjA6ICfomZrnqbonLFxuXHRcdFx0XHQyMTogJ+a4hea1hCdcblx0XHRcdH0sXG5cdFx0XHR3YXJpRnVsbDoge1xuXHRcdFx0XHQxOiAn5YmyJyxcblx0XHRcdFx0MjogJ+WIhicsXG5cdFx0XHRcdDM6ICfljpgnLFxuXHRcdFx0XHQ0OiAn5q+bJyxcblx0XHRcdFx0NTogJ+ezuCcsXG5cdFx0XHRcdDY6ICflv70nLFxuXHRcdFx0XHQ3OiAn5b6uJyxcblx0XHRcdFx0ODogJ+e5iicsXG5cdFx0XHRcdDk6ICfmspknLFxuXHRcdFx0XHQxMDogJ+WhtScsXG5cdFx0XHRcdDExOiAn5Z+DJyxcblx0XHRcdFx0MTI6ICfmuLonLFxuXHRcdFx0XHQxMzogJ+a8oCcsXG5cdFx0XHRcdDE0OiAn5qih57OKJyxcblx0XHRcdFx0MTU6ICfpgKHlt6EnLFxuXHRcdFx0XHQxNjogJ+mgiOiHvicsXG5cdFx0XHRcdDE3OiAn556s5oGvJyxcblx0XHRcdFx0MTg6ICflvL7mjIcnLFxuXHRcdFx0XHQxOTogJ+WIuemCoycsXG5cdFx0XHRcdDIwOiAn5YWt5b6zJyxcblx0XHRcdFx0MjE6ICfomZrnqbonLFxuXHRcdFx0XHQyMjogJ+a4hea1hCdcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0amFwYW5lc2UudHJhbnNjcmliZU51bWJlciA9IGZ1bmN0aW9uIChudW1iZXIsIGNvbmZpZykge1xuXHRcdGlmICh0eXBlb2YgY29uZmlnID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0Ly8gZGVmYXVsdCBjb25maWdcblx0XHRcdGNvbmZpZyA9IGphcGFuZXNlLnRyYW5zY3JpcHRpb25Db25maWdzWydkZWZhdWx0J107XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRjb25maWcgPSBqYXBhbmVzZS50cmFuc2NyaXB0aW9uQ29uZmlnc1tjb25maWddO1xuXG5cdFx0XHRpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0dGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdUcmFuc2NyaXB0aW9uIG1ldGhvZCBcIicgKyBjb25maWcgKyAnXCIgaXMgdW5kZWZpbmVkJyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCh0eXBlb2YgY29uZmlnID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihjb25maWcpKSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdGNvbmZpZyA9IGV4dGVuZCh7fSwgamFwYW5lc2UudHJhbnNjcmlwdGlvbkNvbmZpZ3NbJ2RlZmF1bHQnXSwgY29uZmlnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdZb3Ugc3BlY2lmaWVkIHVua25vd24gY29uZmlnIHRvIGphcGFuZXNlLnRyYW5zY3JpYmVOdW1iZXInKTtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIGNvbmZpZy5kaWdpdHMgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRjb25maWcuZGlnaXRzID0gamFwYW5lc2UucHJlZGVmaW5lZWRUcmFuc2NyaXB0aW9uQ29uZmlncy5kaWdpdHNbY29uZmlnLmRpZ2l0c107XG5cblx0XHRcdGlmICh0eXBlb2YgY29uZmlnLmRpZ2l0cyA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0dGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdUcmFuc2NyaXB0aW9uIG1ldGhvZCBvZiBkaWdpdHMgXCInICsgY29uZmlnLmRpZ2l0cyArICdcIiBpcyB1bmRlZmluZWQnKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIGNvbmZpZy51bml0TmFtZXMgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRjb25maWcudW5pdE5hbWVzID0gamFwYW5lc2UucHJlZGVmaW5lZWRUcmFuc2NyaXB0aW9uQ29uZmlncy51bml0TmFtZXNbY29uZmlnLnVuaXROYW1lc107XG5cblx0XHRcdGlmICh0eXBlb2YgY29uZmlnLnVuaXROYW1lcyA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0dGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdUcmFuc2NyaXB0aW9uIG1ldGhvZCBvZiB1bml0TmFtZXMgXCInICsgY29uZmlnLnVuaXROYW1lcyArICdcIiBpcyB1bmRlZmluZWQnKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIGNvbmZpZy5zcGVjaWFsVW5pdE5hbWVzID09PSAnc3RyaW5nJykge1xuXHRcdFx0Y29uZmlnLnNwZWNpYWxVbml0TmFtZXMgPSBqYXBhbmVzZS5wcmVkZWZpbmVlZFRyYW5zY3JpcHRpb25Db25maWdzLnNwZWNpYWxVbml0TmFtZXNbY29uZmlnLnNwZWNpYWxVbml0TmFtZXNdO1xuXG5cdFx0XHRpZiAodHlwZW9mIGNvbmZpZy5zcGVjaWFsVW5pdE5hbWVzID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHR0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ1RyYW5zY3JpcHRpb24gbWV0aG9kIG9mIHNwZWNpYWxVbml0TmFtZXMgXCInICsgY29uZmlnLnNwZWNpYWxVbml0TmFtZXMgKyAnXCIgaXMgdW5kZWZpbmVkJyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBjb25maWcuc21hbGxVbml0TmFtZXMgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRjb25maWcuc21hbGxVbml0TmFtZXMgPSBqYXBhbmVzZS5wcmVkZWZpbmVlZFRyYW5zY3JpcHRpb25Db25maWdzLnNtYWxsVW5pdE5hbWVzW2NvbmZpZy5zbWFsbFVuaXROYW1lc107XG5cblx0XHRcdGlmICh0eXBlb2YgY29uZmlnLnNtYWxsVW5pdE5hbWVzID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHR0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ1RyYW5zY3JpcHRpb24gbWV0aG9kIG9mIHNtYWxsVW5pdE5hbWVzIFwiJyArIGNvbmZpZy5zbWFsbFVuaXROYW1lcyArICdcIiBpcyB1bmRlZmluZWQnKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBVbmlmeSBpbnB1dCB0byBzdHJpbmdcblxuXHRcdGlmICh0eXBlb2YgbnVtYmVyID09PSAnbnVtYmVyJykge1xuXHRcdFx0aWYgKE1JTl9TQUZFX0lOVEVHRVIgPD0gbnVtYmVyICYmIG51bWJlciA8IE1BWF9TQUZFX0lOVEVHRVIpIHtcblx0XHRcdFx0bnVtYmVyID0gbnVtYmVyLnRvU3RyaW5nKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBQYXN0ZSBudW1iZXIgaW50byBiaW5hcnkgZm9ybVxuXHRcdFx0XHR2YXIgYnVmID0gbmV3IEJ1ZmZlcig4KTtcblx0XHRcdFx0YnVmLndyaXRlRG91YmxlQkUobnVtYmVyLCAwKTtcblxuXHRcdFx0XHR2YXIgc2lnbiA9IGdldEJpdChidWYsIDApO1xuXHRcdFx0XHR2YXIgZXhwb25lbnQgPSBnZXRCaXRzKGJ1ZiwgMSwgMTEpO1xuXHRcdFx0XHR2YXIgbWFudGlzc2EgPSBnZXRCaXRzKGJ1ZiwgMTIsIDUyKTtcblx0XHRcdFx0dmFyIGZyYWN0aW9uID0gbnVsbDtcblxuXHRcdFx0XHRleHBvbmVudCA9IHBhcnNlSW50KGV4cG9uZW50LnRvU3RyaW5nKCkpO1xuXG5cdFx0XHRcdGlmIChleHBvbmVudCA9PT0gMCkge1xuXHRcdFx0XHRcdGZyYWN0aW9uID0gbWFudGlzc2E7XG5cdFx0XHRcdFx0ZXhwb25lbnQgPSAxO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZyYWN0aW9uID0gbmV3IEJpZygyKS5wb3coNTIpLnBsdXMobWFudGlzc2EpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bnVtYmVyID0gZnJhY3Rpb24udGltZXMobmV3IEJpZygyKS5wb3coZXhwb25lbnQgLSAxMDIzIC0gNTIpKS50b0ZpeGVkKCk7XG5cblx0XHRcdFx0aWYgKHNpZ24pIHtcblx0XHRcdFx0XHRudW1iZXIgPSAnLScgKyBudW1iZXI7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBudW1iZXIgIT09ICdzdHJpbmcnKSB7XG5cdFx0XHR0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ1R5cGUgb2YgYG51bWJlcmAgaXMgdW5zdXBwb3J0ZWQnKTtcblx0XHR9XG5cblx0XHR2YXIgbGVuZ3RoID0gbnVtYmVyLmxlbmd0aDtcblxuXHRcdC8vIE1haW4gY29udmVydGlvbiBzdGFydHMgaGVyZVxuXG5cdFx0dmFyIGxpdCA9ICcnO1xuXHRcdHZhciByZXN0b3JlWmVybyA9IGZhbHNlO1xuXHRcdGlmIChjb25maWcudW5pdE5hbWVzLmxpdCAmJiBsZW5ndGggPiBjb25maWcudW5pdE5hbWVzLmxpdCkge1xuXHRcdFx0bGl0ID0gbnVtYmVyLnNsaWNlKDAsIC1jb25maWcudW5pdE5hbWVzLmxpdCkuc3BsaXQoJycpLm1hcChmdW5jdGlvbiAoZGlnaXQpIHtcblx0XHRcdFx0cmV0dXJuIGNvbmZpZy5kaWdpdHNbZGlnaXRdO1xuXHRcdFx0fSkuam9pbignJyk7XG5cblx0XHRcdG51bWJlciA9IG51bWJlci5zbGljZSgtY29uZmlnLnVuaXROYW1lcy5saXQpO1xuXHRcdFx0bGVuZ3RoID0gbnVtYmVyLmxlbmd0aDtcblx0XHRcdGlmIChudW1iZXJbMF0gPT09ICcwJykge1xuXHRcdFx0XHRyZXN0b3JlWmVybyA9IHRydWU7XG5cdFx0XHRcdG51bWJlciA9ICc5JyArIG51bWJlci5zbGljZSgxKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBoYW5kbGUgemVyb1xuXHRcdGlmIChudW1iZXIgPT09ICcwJykge1xuXHRcdFx0cmV0dXJuIGNvbmZpZy5kaWdpdHNbMF07XG5cdFx0fVxuXG5cdFx0dmFyIHRyYW5zY3JpcHRpb24gPSAnJztcblxuXHRcdGlmIChudW1iZXIuc2xpY2UoLTEpICE9PSAnMCcpIHtcblx0XHRcdHRyYW5zY3JpcHRpb24gKz0gY29uZmlnLmRpZ2l0c1tudW1iZXIuc2xpY2UoLTEpXTtcblx0XHR9XG5cblx0XHQvLyBHZXQgc2FuaXRpemVkIHVuaXQgbmFtZSBrZXlzXG5cdFx0dmFyIGtleXNPZlVuaXROYW1lcyA9IE9iamVjdC5rZXlzKGNvbmZpZy51bml0TmFtZXMpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHQvLyBjb252ZXJ0IHRvIGludFxuXHRcdFx0cmV0dXJuIHBhcnNlSW50KGtleSk7XG5cdFx0fSkuZmlsdGVyKGZ1bmN0aW9uIChrZXksIGluZGV4LCBzZWxmKSB7XG5cdFx0XHQvLyB1bmlxdWVcblx0XHRcdHJldHVybiBzZWxmLmluZGV4T2Yoa2V5KSA9PT0gaW5kZXg7XG5cdFx0fSkuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdC8vIHZhbGlkYXRlXG5cdFx0XHRyZXR1cm4gaXNGaW5pdGUoa2V5KSAmJiBrZXkgPiAwO1xuXHRcdH0pLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcblx0XHRcdC8vIGFzYyBzb3J0XG5cdFx0XHRyZXR1cm4gYSAtIGI7XG5cdFx0fSk7XG5cblx0XHRrZXlzT2ZVbml0TmFtZXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpbmRleCkge1xuXHRcdFx0dmFyIG5leHRLZXkgPSBrZXlzT2ZVbml0TmFtZXNbaW5kZXggKyAxXSB8fCBJbmZpbml0eTtcblx0XHRcdC8vIHNsaWNlIHRoZSBkaWdpdHMgc3BhbmVkIGJ5IHRoZSB1bml0IG5hbWVcblx0XHRcdHZhciB0b2tlbiA9IG51bWJlci5zbGljZShNYXRoLm1heChsZW5ndGggLSBuZXh0S2V5LCAwKSwgTWF0aC5tYXgobGVuZ3RoIC0ga2V5LCAwKSk7XG5cblx0XHRcdGlmICh0b2tlbi5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdC8vIGNoZWNrIGlmIGV2ZXJ5IG51bWJlciBpbiB0aGUgdG9rZW4gaXMgemVyb1xuXHRcdFx0XHRpZiAoIXRva2VuLnNwbGl0KCcnKS5ldmVyeShmdW5jdGlvbiAoZGlnaXQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZGlnaXQgPT09ICcwJztcblx0XHRcdFx0fSkpIHtcblx0XHRcdFx0XHQvLyB0cnVuY2F0ZU9uZVxuXHRcdFx0XHRcdGlmIChjb25maWcudHJ1bmNhdGVPbmUuaW5kZXhPZihjb25maWcudW5pdE5hbWVzW2tleV0pICE9PSAtMSAmJiBwYXJzZUludCh0b2tlbikgPT09IDEpIHtcblx0XHRcdFx0XHRcdHRyYW5zY3JpcHRpb24gPSBjb25maWcudW5pdE5hbWVzW2tleV0gKyB0cmFuc2NyaXB0aW9uO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0cmFuc2NyaXB0aW9uID0gamFwYW5lc2UudHJhbnNjcmliZU51bWJlcih0b2tlbiwgY29uZmlnKSArIGNvbmZpZy51bml0TmFtZXNba2V5XSArIHRyYW5zY3JpcHRpb247XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvLyBSZWpvaW4gbGl0IHRva2Vuc1xuXHRcdGlmIChyZXN0b3JlWmVybykge1xuXHRcdFx0dHJhbnNjcmlwdGlvbiA9IHRyYW5zY3JpcHRpb24ucmVwbGFjZShuZXcgUmVnRXhwKCdeJyArIGNvbmZpZy5kaWdpdHNbOV0pLCBjb25maWcuZGlnaXRzWzBdKTtcblx0XHR9XG5cdFx0dHJhbnNjcmlwdGlvbiA9IGxpdCArIHRyYW5zY3JpcHRpb247XG5cblx0XHRyZXR1cm4gdHJhbnNjcmlwdGlvbjtcblx0fTtcblxuXHRyZXR1cm4gamFwYW5lc2U7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbnZhciBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoamFwYW5lc2UpIHtcblx0amFwYW5lc2Uucm9tYW5pemF0aW9uVGFibGUgPSB7XG5cdFx0J+OBgic6ICdhJyxcblx0XHQn44GEJzogJ2knLFxuXHRcdCfjgYYnOiAndScsXG5cdFx0J+OBiCc6ICdlJyxcblx0XHQn44GKJzogJ28nLFxuXHRcdCfjgYsnOiAna2EnLFxuXHRcdCfjgY0nOiAna2knLFxuXHRcdCfjgY8nOiAna3UnLFxuXHRcdCfjgZEnOiAna2UnLFxuXHRcdCfjgZMnOiAna28nLFxuXHRcdCfjgZUnOiAnc2EnLFxuXHRcdCfjgZcnOiAnc2knLFxuXHRcdCfjgZknOiAnc3UnLFxuXHRcdCfjgZsnOiAnc2UnLFxuXHRcdCfjgZ0nOiAnc28nLFxuXHRcdCfjgZ8nOiAndGEnLFxuXHRcdCfjgaEnOiAndGknLFxuXHRcdCfjgaQnOiAndHUnLFxuXHRcdCfjgaYnOiAndGUnLFxuXHRcdCfjgagnOiAndG8nLFxuXHRcdCfjgaonOiAnbmEnLFxuXHRcdCfjgasnOiAnbmknLFxuXHRcdCfjgawnOiAnbnUnLFxuXHRcdCfjga0nOiAnbmUnLFxuXHRcdCfjga4nOiAnbm8nLFxuXHRcdCfjga8nOiAnaGEnLFxuXHRcdCfjgbInOiAnaGknLFxuXHRcdCfjgbUnOiAnaHUnLFxuXHRcdCfjgbgnOiAnaGUnLFxuXHRcdCfjgbsnOiAnaG8nLFxuXHRcdCfjgb4nOiAnbWEnLFxuXHRcdCfjgb8nOiAnbWknLFxuXHRcdCfjgoAnOiAnbXUnLFxuXHRcdCfjgoEnOiAnbWUnLFxuXHRcdCfjgoInOiAnbW8nLFxuXHRcdCfjgoQnOiAneWEnLFxuXHRcdCfjgoYnOiAneXUnLFxuXHRcdCfjgognOiAneW8nLFxuXHRcdCfjgoknOiAncmEnLFxuXHRcdCfjgoonOiAncmknLFxuXHRcdCfjgosnOiAncnUnLFxuXHRcdCfjgownOiAncmUnLFxuXHRcdCfjgo0nOiAncm8nLFxuXHRcdCfjgo8nOiAnd2EnLFxuXHRcdCfjgpAnOiAnd2knLFxuXHRcdCfjgpEnOiAnd2UnLFxuXHRcdCfjgpInOiAnd28nLFxuXHRcdCfjgpMnOiAnbicsXG5cdFx0J+OBjCc6ICdnYScsXG5cdFx0J+OBjic6ICdnaScsXG5cdFx0J+OBkCc6ICdndScsXG5cdFx0J+OBkic6ICdnZScsXG5cdFx0J+OBlCc6ICdnbycsXG5cdFx0J+OBlic6ICd6YScsXG5cdFx0J+OBmCc6ICd6aScsXG5cdFx0J+OBmic6ICd6dScsXG5cdFx0J+OBnCc6ICd6ZScsXG5cdFx0J+OBnic6ICd6bycsXG5cdFx0J+OBoCc6ICdkYScsXG5cdFx0J+OBoic6ICdkaScsXG5cdFx0J+OBpSc6ICdkdScsXG5cdFx0J+OBpyc6ICdkZScsXG5cdFx0J+OBqSc6ICdkbycsXG5cdFx0J+OBsCc6ICdiYScsXG5cdFx0J+OBsyc6ICdiaScsXG5cdFx0J+OBtic6ICdidScsXG5cdFx0J+OBuSc6ICdiZScsXG5cdFx0J+OBvCc6ICdibycsXG5cdFx0J+OClCc6ICd2dScsXG5cdFx0J+OBsSc6ICdwYScsXG5cdFx0J+OBtCc6ICdwaScsXG5cdFx0J+OBtyc6ICdwdScsXG5cdFx0J+OBuic6ICdwZScsXG5cdFx0J+OBvSc6ICdwbycsXG5cdFx0J+OBjeOCgyc6ICdreWEnLFxuXHRcdCfjgY3jgoUnOiAna3l1Jyxcblx0XHQn44GN44GHJzogJ2t5ZScsXG5cdFx0J+OBjeOChyc6ICdreW8nLFxuXHRcdCfjgZfjgoMnOiAnc3lhJyxcblx0XHQn44GX44KFJzogJ3N5dScsXG5cdFx0J+OBl+OBhyc6ICdzeWUnLFxuXHRcdCfjgZfjgocnOiAnc3lvJyxcblx0XHQn44Gh44KDJzogJ3R5YScsXG5cdFx0J+OBoeOChSc6ICd0eXUnLFxuXHRcdCfjgaHjgYcnOiAndHllJyxcblx0XHQn44Gh44KHJzogJ3R5bycsXG5cdFx0J+OBq+OCgyc6ICdueWEnLFxuXHRcdCfjgavjgoUnOiAnbnl1Jyxcblx0XHQn44Gr44GHJzogJ255ZScsXG5cdFx0J+OBq+OChyc6ICdueW8nLFxuXHRcdCfjgbLjgoMnOiAnaHlhJyxcblx0XHQn44Gy44KFJzogJ2h5dScsXG5cdFx0J+OBsuOBhyc6ICdoeWUnLFxuXHRcdCfjgbLjgocnOiAnaHlvJyxcblx0XHQn44G/44KDJzogJ215YScsXG5cdFx0J+OBv+OChSc6ICdteScsXG5cdFx0J+OBv+OBhyc6ICdteWUnLFxuXHRcdCfjgb/jgocnOiAnbXlvJyxcblx0XHQn44KK44KDJzogJ3J5YScsXG5cdFx0J+OCiuOChSc6ICdyeXUnLFxuXHRcdCfjgorjgYcnOiAncnllJyxcblx0XHQn44KK44KHJzogJ3J5bycsXG5cdFx0J+OBjuOCgyc6ICdneWEnLFxuXHRcdCfjgY7jgoUnOiAnZ3l1Jyxcblx0XHQn44GO44GHJzogJ2d5ZScsXG5cdFx0J+OBjuOChyc6ICdneW8nLFxuXHRcdCfjgZjjgoMnOiAnenlhJyxcblx0XHQn44GY44KFJzogJ3p5dScsXG5cdFx0J+OBmOOBhyc6ICd6eWUnLFxuXHRcdCfjgZjjgocnOiAnenlvJyxcblx0XHQn44Gi44KDJzogJ2R5YScsXG5cdFx0J+OBouOChSc6ICdkeXUnLFxuXHRcdCfjgaLjgYcnOiAnZHllJyxcblx0XHQn44Gi44KHJzogJ2R5bycsXG5cdFx0J+OBs+OCgyc6ICdieWEnLFxuXHRcdCfjgbPjgoUnOiAnYnl1Jyxcblx0XHQn44Gz44GHJzogJ2J5ZScsXG5cdFx0J+OBs+OChyc6ICdieW8nLFxuXHRcdCfjgpTjgYEnOiAndmEnLFxuXHRcdCfjgpTjgYMnOiAndmknLFxuXHRcdCfjgpTjgYcnOiAndmUnLFxuXHRcdCfjgpTjgYknOiAndm8nLFxuXHRcdCfjgbTjgoMnOiAncHlhJyxcblx0XHQn44G044KFJzogJ3B5dScsXG5cdFx0J+OBtOOBhyc6ICdweWUnLFxuXHRcdCfjgbTjgocnOiAncHlvJyxcblx0XHQvKlxyXG4gICAqIFJhcmVseSB1c2VkIGNoYXJhY3RlciBjb21iaW5hdGlvbnNcclxuICAgKlxyXG4gICAqIFRoZXNlIHJvbWFuaXphdGlvbnMgYXJlIG5vcm1hbGx5IG5vdCBkZWZpbmVkIGluIG1vc3Qgc3BlY2lmaWNhdGlvbnMgYW5kXHJcbiAgICogdmVyeSBoYXJkIHRvIHZlcmlmeSB0aGVyZWZvcmUuXHJcbiAgICogSW4gdGhpcyBsaWJyYXJ5LCBtb3N0IG9mIHRoZSBjb2RlcyBhcmUgZGVyaXZlZCBmcm9tIGZvbGxvd2luZyBXaWtpcGVkaWEgYXJ0aWNsZS5cclxuICAgKiBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0hlcGJ1cm5fcm9tYW5pemF0aW9uI0Zvcl9leHRlbmRlZF9rYXRha2FuYVxyXG4gICAqL1xuXHRcdCfjgYTjgYMnOiAneWknLFxuXHRcdCfjgYTjgYcnOiAneWUnLFxuXHRcdCfjgYbjgYEnOiAnd2EnLFxuXHRcdCfjgYbjgYMnOiAnd2knLFxuXHRcdCfjgYbjgYUnOiAnd3UnLFxuXHRcdCfjgYbjgYcnOiAnd2UnLFxuXHRcdCfjgYbjgYknOiAnd28nLFxuXHRcdCfjgYbjgoUnOiAnd3l1Jyxcblx0XHQn44KU44KDJzogJ3Z5YScsXG5cdFx0J+OClOOChSc6ICd2eXUnLFxuXHRcdCfjgpTjgocnOiAndnlvJyxcblx0XHQn44GP44GBJzogJ2t3YScsXG5cdFx0J+OBj+OBgyc6ICdrd2knLFxuXHRcdCfjgY/jgYUnOiAna3d1Jyxcblx0XHQn44GP44GHJzogJ2t3ZScsXG5cdFx0J+OBj+OBiSc6ICdrd28nLFxuXHRcdCfjgY/jgo4nOiAna3dhJyxcblx0XHQn44GQ44GBJzogJ2d3YScsXG5cdFx0J+OBkOOBgyc6ICdnd2knLFxuXHRcdCfjgZDjgYUnOiAnZ3d1Jyxcblx0XHQn44GQ44GHJzogJ2d3ZScsXG5cdFx0J+OBkOOBiSc6ICdnd28nLFxuXHRcdCfjgZDjgo4nOiAnZ3dhJyxcblx0XHQn44GZ44GDJzogJ3NpJyxcblx0XHQn44Ga44GDJzogJ3ppJyxcblx0XHQn44Gk44GBJzogJ3R1YScsXG5cdFx0J+OBpOOBgyc6ICd0dWknLFxuXHRcdCfjgaTjgYcnOiAndHVlJyxcblx0XHQn44Gk44GJJzogJ3R1bycsXG5cdFx0J+OBpOOChSc6ICd0dXl1Jyxcblx0XHQn44Gl44GBJzogJ2R1YScsXG5cdFx0J+OBpeOBgyc6ICdkdWknLFxuXHRcdCfjgaXjgYcnOiAnZHVlJyxcblx0XHQn44Gl44GJJzogJ2R1bycsXG5cdFx0J+OBpuOCgyc6ICd0ZWEnLFxuXHRcdCfjgabjgYMnOiAndGVpJyxcblx0XHQn44Gm44KFJzogJ3RldScsXG5cdFx0J+OBpuOBhyc6ICd0ZWUnLFxuXHRcdCfjgabjgocnOiAndGVvJyxcblx0XHQn44Go44GFJzogJ3RvdScsXG5cdFx0J+OBp+OCgyc6ICdkZWEnLFxuXHRcdCfjgafjgYMnOiAnZGVpJyxcblx0XHQn44Gn44KFJzogJ2RldScsXG5cdFx0J+OBp+OBhyc6ICdkZWUnLFxuXHRcdCfjgafjgocnOiAnZGVvJyxcblx0XHQn44Gp44GFJzogJ2RvdScsXG5cdFx0J+OBteOBgSc6ICdodWEnLFxuXHRcdCfjgbXjgYMnOiAnaHVpJyxcblx0XHQn44G144GHJzogJ2h1ZScsXG5cdFx0J+OBteOBiSc6ICdodW8nLFxuXHRcdCfjgbXjgoMnOiAnaHV5YScsXG5cdFx0J+OBteOChSc6ICdodXl1Jyxcblx0XHQn44G144KHJzogJ2h1eW8nLFxuXHRcdCfjgbvjgYUnOiAnaHUnLFxuXHRcdCfjgonjgponOiAnbGEnLFxuXHRcdCfjgorjgponOiAnbGknLFxuXHRcdCfjgovjgponOiAnbHUnLFxuXHRcdCfjgozjgponOiAnbGUnLFxuXHRcdCfjgo3jgponOiAnbG8nLFxuXHRcdCfjgo/jgpknOiAndmEnLFxuXHRcdCfjgpDjgpknOiAndmknLFxuXHRcdCfjgpHjgpknOiAndmUnLFxuXHRcdCfjgpLjgpknOiAndm8nLFxuXHRcdCfjgYEnOiAnYScsXG5cdFx0J+OBgyc6ICdpJyxcblx0XHQn44GFJzogJ3UnLFxuXHRcdCfjgYcnOiAnZScsXG5cdFx0J+OBiSc6ICdvJyxcblx0XHQn44KDJzogJ3lhJyxcblx0XHQn44KFJzogJ3l1Jyxcblx0XHQn44KHJzogJ3lvJyxcblx0XHQn44GjJzogJ3R1Jyxcblx0XHQn44KOJzogJ3dhJyxcblx0XHQn44O1JzogJ2thJyxcblx0XHQn44O2JzogJ2tlJ1xuXHR9O1xuXG5cdGphcGFuZXNlLnJvbWFuaXplUHVuY3V0dWF0aW9uVGFibGUgPSB7XG5cdFx0J+OAgic6ICcuJyxcblx0XHQn44CBJzogJywnLFxuXHRcdCfjg7snOiAnLScsXG5cdFx0J++8jSc6ICctJyxcblx0XHQn44CMJzogJ+KAnCcsXG5cdFx0J+OAjSc6ICfigJ0nLFxuXHRcdCfvvIgnOiAnKCcsXG5cdFx0J++8iSc6ICcpJyxcblx0XHQn44CAJzogJyAnLFxuXHRcdCcgJzogJyAnXG5cdH07XG5cblx0amFwYW5lc2UuZGVmYXVsdFJvbWFuaXphdGlvbkNvbmZpZyA9IHtcblx0XHQn44GXJzogJ3NoaScsXG5cdFx0J+OBoSc6ICdjaGknLFxuXHRcdCfjgaQnOiAndHN1Jyxcblx0XHQn44G1JzogJ2Z1Jyxcblx0XHQn44GYJzogJ2ppJyxcblx0XHQn44GiJzogJ2ppJyxcblx0XHQn44GlJzogJ3p1Jyxcblx0XHQn44GC44GCJzogJ2FhJyxcblx0XHQn44GE44GEJzogJ2lpJyxcblx0XHQn44GG44GGJzogJ8WrJyxcblx0XHQn44GI44GIJzogJ2VlJyxcblx0XHQn44GK44GKJzogJ8WNJyxcblx0XHQn44GC44O8JzogJ8SBJyxcblx0XHQn44GI44GEJzogJ2VpJyxcblx0XHQn44GK44GGJzogJ8WNJyxcblx0XHQn44KT44GCJzogJ25cXCdhJyxcblx0XHQn44KT44GwJzogJ25iYScsXG5cdFx0J+OBo+OBoSc6ICd0Y2hpJyxcblx0XHQn44KQJzogJ2knLFxuXHRcdCfjgpInOiAnbycsXG5cdFx0cHVuY3R1YXRpb246IHRydWVcblx0fTtcblxuXHRqYXBhbmVzZS5yb21hbml6YXRpb25Db25maWdzID0ge1xuXHRcdHdpa2lwZWRpYToge30sXG5cdFx0J3RyYWRpdGlvbmFsIGhlcGJ1cm4nOiB7XG5cdFx0XHQn44KSJzogJ3dvJyxcblx0XHRcdCfjgpPjgYInOiAnbi1hJyxcblx0XHRcdCfjgpPjgbAnOiAnbWJhJ1xuXHRcdH0sXG5cdFx0J21vZGlmaWVkIGhlcGJ1cm4nOiB7XG5cdFx0XHQn44GC44GCJzogJ8SBJyxcblx0XHRcdCfjgYTjgYQnOiAnaWknLFxuXHRcdFx0J+OBhuOBhic6ICfFqycsXG5cdFx0XHQn44GI44GIJzogJ8STJyxcblx0XHRcdCfjgYrjgYonOiAnxY0nXG5cdFx0fSxcblx0XHRrdW5yZWk6IHtcblx0XHRcdCfjgZcnOiAnc2knLFxuXHRcdFx0J+OBoSc6ICd0aScsXG5cdFx0XHQn44GkJzogJ3R1Jyxcblx0XHRcdCfjgbUnOiAnaHUnLFxuXHRcdFx0J+OBmCc6ICd6aScsXG5cdFx0XHQn44GiJzogJ3ppJyxcblx0XHRcdCfjgaUnOiAnenUnLFxuXHRcdFx0J+OBguOBgic6ICfDoicsXG5cdFx0XHQn44GE44GEJzogJ8OuJyxcblx0XHRcdCfjgYbjgYYnOiAnw7snLFxuXHRcdFx0J+OBiOOBiCc6ICfDqicsXG5cdFx0XHQn44GK44GKJzogJ8O0Jyxcblx0XHRcdCfjgYLjg7wnOiAnw6InLFxuXHRcdFx0J+OBiuOBhic6ICfDtCcsXG5cdFx0XHQn44Gj44GhJzogJ3R0aSdcblx0XHR9LFxuXHRcdG5paG9uOiB7XG5cdFx0XHQn44GXJzogJ3NpJyxcblx0XHRcdCfjgaEnOiAndGknLFxuXHRcdFx0J+OBpCc6ICd0dScsXG5cdFx0XHQn44G1JzogJ2h1Jyxcblx0XHRcdCfjgZgnOiAnemknLFxuXHRcdFx0J+OBoic6ICdkaScsXG5cdFx0XHQn44GlJzogJ2R1Jyxcblx0XHRcdCfjgYLjgYInOiAnxIEnLFxuXHRcdFx0J+OBhOOBhCc6ICfEqycsXG5cdFx0XHQn44GG44GGJzogJ8WrJyxcblx0XHRcdCfjgYjjgYgnOiAnxJMnLFxuXHRcdFx0J+OBiuOBiic6ICfFjScsXG5cdFx0XHQn44GC44O8JzogJ8SBJyxcblx0XHRcdCfjgYrjgYYnOiAnxY0nLFxuXHRcdFx0J+OBo+OBoSc6ICd0dGknLFxuXHRcdFx0J+OCkCc6ICd3aScsXG5cdFx0XHQn44KSJzogJ3dvJ1xuXHRcdH1cblx0fTtcblxuXHRqYXBhbmVzZS5yb21hbml6ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIGNvbmZpZykge1xuXHRcdGlmICh0eXBlb2YgY29uZmlnID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0Y29uZmlnID0gJ3dpa2lwZWRpYSc7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRjb25maWcgPSBqYXBhbmVzZS5yb21hbml6YXRpb25Db25maWdzW2NvbmZpZ107XG5cblx0XHRcdGlmICh0eXBlb2YgY29uZmlnID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHR0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ1JvbWFuaXphdGlvbiBtZXRob2QgXCInICsgY29uZmlnICsgJ1wiIGlzIHVuZGVmaW5lZCcpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICgodHlwZW9mIGNvbmZpZyA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YoY29uZmlnKSkgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRjb25maWcgPSBleHRlbmQoe30sIGphcGFuZXNlLmRlZmF1bHRSb21hbml6YXRpb25Db25maWcsIGNvbmZpZyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignWW91IHNwZWNpZmllZCB1bmtub3duIGNvbmZpZyB0byBqYXBhbmVzZS5yb21hbml6ZScpO1xuXHRcdH1cblxuXHRcdHZhciB0YWJsZSA9IGV4dGVuZCh7fSwgamFwYW5lc2Uucm9tYW5pemF0aW9uVGFibGUpO1xuXG5cdFx0aWYgKGNvbmZpZ1sn44GXJ10gPT09ICdzaGknKSB7XG5cdFx0XHRleHRlbmQodGFibGUsIHtcblx0XHRcdFx0J+OBlyc6ICdzaGknLFxuXHRcdFx0XHQn44GX44KDJzogJ3NoYScsXG5cdFx0XHRcdCfjgZfjgoUnOiAnc2h1Jyxcblx0XHRcdFx0J+OBl+OBhyc6ICdzaGUnLFxuXHRcdFx0XHQn44GX44KHJzogJ3Nobydcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmIChjb25maWdbJ+OBoSddID09PSAnY2hpJykge1xuXHRcdFx0ZXh0ZW5kKHRhYmxlLCB7XG5cdFx0XHRcdCfjgaEnOiAnY2hpJyxcblx0XHRcdFx0J+OBoeOCgyc6ICdjaGEnLFxuXHRcdFx0XHQn44Gh44KFJzogJ2NodScsXG5cdFx0XHRcdCfjgaHjgYcnOiAnY2hlJyxcblx0XHRcdFx0J+OBoeOChyc6ICdjaG8nLFxuXHRcdFx0XHQn44Gm44GDJzogJ3RpJyxcblx0XHRcdFx0J+OBpuOChSc6ICd0eXUnXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAoY29uZmlnWyfjgaQnXSA9PT0gJ3RzdScpIHtcblx0XHRcdGV4dGVuZCh0YWJsZSwge1xuXHRcdFx0XHQn44GkJzogJ3RzdScsXG5cdFx0XHRcdCfjgaTjgYEnOiAndHNhJyxcblx0XHRcdFx0J+OBpOOBgyc6ICd0c2knLFxuXHRcdFx0XHQn44Gk44GHJzogJ3RzZScsXG5cdFx0XHRcdCfjgaTjgYknOiAndHNvJyxcblx0XHRcdFx0J+OBpOOChSc6ICd0c3l1Jyxcblx0XHRcdFx0J+OBqOOBhSc6ICd0dSdcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmIChjb25maWdbJ+OBtSddID09PSAnZnUnKSB7XG5cdFx0XHRleHRlbmQodGFibGUsIHtcblx0XHRcdFx0J+OBtSc6ICdmdScsXG5cdFx0XHRcdCfjgbXjgYEnOiAnZmEnLFxuXHRcdFx0XHQn44G144GDJzogJ2ZpJyxcblx0XHRcdFx0J+OBteOBhyc6ICdmZScsXG5cdFx0XHRcdCfjgbXjgYknOiAnZm8nLFxuXHRcdFx0XHQn44G144KDJzogJ2Z5YScsXG5cdFx0XHRcdCfjgbXjgoUnOiAnZnl1Jyxcblx0XHRcdFx0J+OBteOChyc6ICdmeW8nXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAoY29uZmlnWyfjgZgnXSA9PT0gJ2ppJykge1xuXHRcdFx0ZXh0ZW5kKHRhYmxlLCB7XG5cdFx0XHRcdCfjgZgnOiAnamknLFxuXHRcdFx0XHQn44GY44KDJzogJ2phJyxcblx0XHRcdFx0J+OBmOOChSc6ICdqdScsXG5cdFx0XHRcdCfjgZjjgYcnOiAnamUnLFxuXHRcdFx0XHQn44GY44KHJzogJ2pvJ1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKGNvbmZpZ1sn44GiJ10gPT09ICdqaScpIHtcblx0XHRcdGV4dGVuZCh0YWJsZSwge1xuXHRcdFx0XHQn44GiJzogJ2ppJyxcblx0XHRcdFx0J+OBouOCgyc6ICdqYScsXG5cdFx0XHRcdCfjgaLjgoUnOiAnanUnLFxuXHRcdFx0XHQn44Gi44GHJzogJ2plJyxcblx0XHRcdFx0J+OBouOChyc6ICdqbycsXG5cdFx0XHRcdCfjgafjgYMnOiAnZGknLFxuXHRcdFx0XHQn44Gn44KFJzogJ2R5dSdcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmIChjb25maWdbJ+OBoiddID09PSAnemknKSB7XG5cdFx0XHRleHRlbmQodGFibGUsIHtcblx0XHRcdFx0J+OBoic6ICd6aScsXG5cdFx0XHRcdCfjgaLjgoMnOiAnenlhJyxcblx0XHRcdFx0J+OBouOChSc6ICd6eXUnLFxuXHRcdFx0XHQn44Gi44GHJzogJ3p5ZScsXG5cdFx0XHRcdCfjgaLjgocnOiAnenlvJyxcblx0XHRcdFx0J+OBp+OBgyc6ICdkaScsXG5cdFx0XHRcdCfjgafjgoUnOiAnZHl1J1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKGNvbmZpZ1sn44GiJ10gPT09ICdkamknKSB7XG5cdFx0XHRleHRlbmQodGFibGUsIHtcblx0XHRcdFx0J+OBoic6ICdkamknLFxuXHRcdFx0XHQn44Gi44KDJzogJ2RqYScsXG5cdFx0XHRcdCfjgaLjgoUnOiAnZGp1Jyxcblx0XHRcdFx0J+OBouOBhyc6ICdkamUnLFxuXHRcdFx0XHQn44Gi44KHJzogJ2RqbycsXG5cdFx0XHRcdCfjgafjgYMnOiAnZGknLFxuXHRcdFx0XHQn44Gn44KFJzogJ2R5dSdcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmIChjb25maWdbJ+OBoiddID09PSAnZHppJykge1xuXHRcdFx0ZXh0ZW5kKHRhYmxlLCB7XG5cdFx0XHRcdCfjgaInOiAnZHppJyxcblx0XHRcdFx0J+OBouOCgyc6ICdkenlhJyxcblx0XHRcdFx0J+OBouOChSc6ICdkenl1Jyxcblx0XHRcdFx0J+OBouOBhyc6ICdkenllJyxcblx0XHRcdFx0J+OBouOChyc6ICdkenlvJyxcblx0XHRcdFx0J+OBp+OBgyc6ICdkaScsXG5cdFx0XHRcdCfjgafjgoUnOiAnZHl1J1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKGNvbmZpZ1sn44GlJ10gPT09ICd6dScpIHtcblx0XHRcdGV4dGVuZCh0YWJsZSwge1xuXHRcdFx0XHQn44GlJzogJ3p1Jyxcblx0XHRcdFx0J+OBpeOBgSc6ICd6dWEnLFxuXHRcdFx0XHQn44Gl44GDJzogJ3p1aScsXG5cdFx0XHRcdCfjgaXjgYcnOiAnenVlJyxcblx0XHRcdFx0J+OBpeOBiSc6ICd6dW8nLFxuXHRcdFx0XHQn44Gp44GFJzogJ2R1J1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKGNvbmZpZ1sn44GlJ10gPT09ICdkc3UnKSB7XG5cdFx0XHRleHRlbmQodGFibGUsIHtcblx0XHRcdFx0J+OBpSc6ICdkc3UnLFxuXHRcdFx0XHQn44Gl44GBJzogJ2RzdWEnLFxuXHRcdFx0XHQn44Gl44GDJzogJ2RzdWknLFxuXHRcdFx0XHQn44Gl44GHJzogJ2RzdWUnLFxuXHRcdFx0XHQn44Gl44GJJzogJ2RzdW8nLFxuXHRcdFx0XHQn44Gp44GFJzogJ2R1J1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKGNvbmZpZ1sn44GlJ10gPT09ICdkenUnKSB7XG5cdFx0XHRleHRlbmQodGFibGUsIHtcblx0XHRcdFx0J+OBpSc6ICdkenUnLFxuXHRcdFx0XHQn44Gl44GBJzogJ2R6dWEnLFxuXHRcdFx0XHQn44Gl44GDJzogJ2R6dWknLFxuXHRcdFx0XHQn44Gl44GHJzogJ2R6dWUnLFxuXHRcdFx0XHQn44Gl44GJJzogJ2R6dW8nLFxuXHRcdFx0XHQn44Gp44GFJzogJ2R1J1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKGNvbmZpZ1sn44KQJ10gPT09ICdpJykge1xuXHRcdFx0ZXh0ZW5kKHRhYmxlLCB7XG5cdFx0XHRcdCfjgpAnOiAnaScsXG5cdFx0XHRcdCfjgpEnOiAnZSdcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmIChjb25maWdbJ+OCkiddID09PSAnbycpIHtcblx0XHRcdGV4dGVuZCh0YWJsZSwge1xuXHRcdFx0XHQn44KSJzogJ28nXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRzdHJpbmcgPSBqYXBhbmVzZS5oaXJhZ2FuaXplKHN0cmluZyk7XG5cblx0XHR2YXIgZGVzdCA9ICcnO1xuXHRcdHZhciBwcmV2aW91c1Rva2VuID0gJyc7XG5cblx0XHR3aGlsZSAoc3RyaW5nLmxlbmd0aCA+IDApIHtcblx0XHRcdHZhciB0b2tlbiA9ICcnO1xuXG5cdFx0XHQvLyBhc3N1bWluZyB3ZSBoYXZlIG9ubHkgb25lIG9yIHR3byBsZXR0ZXIgdG9rZW4gaW4gdGFibGVcblx0XHRcdGlmICh0YWJsZVtzdHJpbmcuc2xpY2UoMCwgMildKSB7XG5cdFx0XHRcdHRva2VuID0gc3RyaW5nLnNsaWNlKDAsIDIpO1xuXHRcdFx0XHRzdHJpbmcgPSBzdHJpbmcuc2xpY2UoMik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0b2tlbiA9IHN0cmluZ1swXTtcblx0XHRcdFx0c3RyaW5nID0gc3RyaW5nLnNsaWNlKDEpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBoYW5kbGUgc21hbGwgdHN1XG5cdFx0XHRpZiAodG9rZW4gPT09ICfjgaMnKSB7XG5cdFx0XHRcdHByZXZpb3VzVG9rZW4gPSB0b2tlbjtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdHZhciB0b2tlbkRlc3QgPSB0YWJsZVt0b2tlbl0gfHwgJyc7XG5cblx0XHRcdC8vIHNtYWxsIHRzdVxuXHRcdFx0aWYgKHByZXZpb3VzVG9rZW4gPT09ICfjgaMnKSB7XG5cdFx0XHRcdGlmICh0b2tlbkRlc3QubWF0Y2goL15bXmFpdWVvXS8pKSB7XG5cdFx0XHRcdFx0aWYgKHRva2VuWzBdID09PSAn44GhJykge1xuXHRcdFx0XHRcdFx0aWYgKGNvbmZpZ1sn44Gj44GhJ10gPT09ICd0Y2hpJykge1xuXHRcdFx0XHRcdFx0XHR0b2tlbkRlc3QgPSB7XG5cdFx0XHRcdFx0XHRcdFx0J+OBoSc6ICd0Y2hpJyxcblx0XHRcdFx0XHRcdFx0XHQn44Gh44KDJzogJ3RjaGEnLFxuXHRcdFx0XHRcdFx0XHRcdCfjgaHjgoUnOiAndGNodScsXG5cdFx0XHRcdFx0XHRcdFx0J+OBoeOBhyc6ICd0Y2hlJyxcblx0XHRcdFx0XHRcdFx0XHQn44Gh44KHJzogJ3RjaG8nXG5cdFx0XHRcdFx0XHRcdH1bdG9rZW5dO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChjb25maWdbJ+OBo+OBoSddID09PSAnY2NoaScpIHtcblx0XHRcdFx0XHRcdFx0dG9rZW5EZXN0ID0ge1xuXHRcdFx0XHRcdFx0XHRcdCfjgaEnOiAnY2NoaScsXG5cdFx0XHRcdFx0XHRcdFx0J+OBoeOCgyc6ICdjY2hhJyxcblx0XHRcdFx0XHRcdFx0XHQn44Gh44KFJzogJ2NjaHUnLFxuXHRcdFx0XHRcdFx0XHRcdCfjgaHjgYcnOiAnY2NoZScsXG5cdFx0XHRcdFx0XHRcdFx0J+OBoeOChyc6ICdjY2hvJ1xuXHRcdFx0XHRcdFx0XHR9W3Rva2VuXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdC8vIG5vcm1hbGx5ICd0dGknXG5cdFx0XHRcdFx0XHRcdHRva2VuRGVzdCA9IHtcblx0XHRcdFx0XHRcdFx0XHQn44GhJzogJ3R0aScsXG5cdFx0XHRcdFx0XHRcdFx0J+OBoeOCgyc6ICd0dHlhJyxcblx0XHRcdFx0XHRcdFx0XHQn44Gh44KFJzogJ3R0eXUnLFxuXHRcdFx0XHRcdFx0XHRcdCfjgaHjgYcnOiAndHR5ZScsXG5cdFx0XHRcdFx0XHRcdFx0J+OBoeOChyc6ICd0dHlvJ1xuXHRcdFx0XHRcdFx0XHR9W3Rva2VuXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dG9rZW5EZXN0ID0gdG9rZW5EZXN0WzBdICsgdG9rZW5EZXN0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvKlxyXG4gICAgICAqIFNvbWUgYXJ0aWNsZSBjbGFpbXMgdGhhdCBcIuODreODvOODnuWtl+aVmeiCsuOBruaMh+mHnSjmlofpg6jnp5HlrabnnIEpXCIgZGVmaW5lcyB0aGF0XHJcbiAgICAgICogc3RyaW5ncyBlbmRpbmcgd2l0aCBcIuOBo1wiIG11c3QgYmUgcmVwcmVzZW50ZWQgd2l0aCB0cmFpbGluZyBhcG9zdHJvcGhlXHJcbiAgICAgICogdGhvdWdoIEkgY291bGRuJ3QgY29uZmlybS5cclxuICAgICAgKi9cblx0XHRcdFx0XHRkZXN0ICs9ICdcXCcnO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIGxvbmcgdm93ZWxcblx0XHRcdGlmICh0b2tlbiA9PT0gJ+ODvCcpIHtcblx0XHRcdFx0aWYgKGRlc3QubWF0Y2goL1thaXVlb10kLykpIHtcblx0XHRcdFx0XHRpZiAoY29uZmlnWyfjgYLjg7wnXSA9PT0gJ2EnKSB7XG5cdFx0XHRcdFx0XHQvLyBub3BlXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChjb25maWdbJ+OBguODvCddID09PSAnYWgnKSB7XG5cdFx0XHRcdFx0XHRcdGRlc3QgKz0gJ2gnO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChjb25maWdbJ+OBguODvCddID09PSAnYS0nKSB7XG5cdFx0XHRcdFx0XHRcdGRlc3QgKz0gJy0nO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChjb25maWdbJ+OBguODvCddID09PSAnYWEnKSB7XG5cdFx0XHRcdFx0XHRcdGRlc3QgPSBkZXN0LnNsaWNlKDAsIC0xKSArIHtcblx0XHRcdFx0XHRcdFx0XHQnYSc6ICdhYScsXG5cdFx0XHRcdFx0XHRcdFx0J2knOiAnaWknLFxuXHRcdFx0XHRcdFx0XHRcdCd1JzogJ3V1Jyxcblx0XHRcdFx0XHRcdFx0XHQnZSc6ICdlZScsXG5cdFx0XHRcdFx0XHRcdFx0J28nOiAnb28nXG5cdFx0XHRcdFx0XHRcdH1bZGVzdC5zbGljZSgtMSldO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChjb25maWdbJ+OBguODvCddID09PSAnw6InKSB7XG5cdFx0XHRcdFx0XHRcdGRlc3QgPSBkZXN0LnNsaWNlKDAsIC0xKSArIHtcblx0XHRcdFx0XHRcdFx0XHQnYSc6ICfDoicsXG5cdFx0XHRcdFx0XHRcdFx0J2knOiAnw64nLFxuXHRcdFx0XHRcdFx0XHRcdCd1JzogJ8O7Jyxcblx0XHRcdFx0XHRcdFx0XHQnZSc6ICfDqicsXG5cdFx0XHRcdFx0XHRcdFx0J28nOiAnw7QnXG5cdFx0XHRcdFx0XHRcdH1bZGVzdC5zbGljZSgtMSldO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChjb25maWdbJ+OBguODvCddID09PSAnxIEnKSB7XG5cdFx0XHRcdFx0XHRcdGRlc3QgPSBkZXN0LnNsaWNlKDAsIC0xKSArIHtcblx0XHRcdFx0XHRcdFx0XHQnYSc6ICfEgScsXG5cdFx0XHRcdFx0XHRcdFx0J2knOiAnxKsnLFxuXHRcdFx0XHRcdFx0XHRcdCd1JzogJ8WrJyxcblx0XHRcdFx0XHRcdFx0XHQnZSc6ICfEkycsXG5cdFx0XHRcdFx0XHRcdFx0J28nOiAnxY0nXG5cdFx0XHRcdFx0XHRcdH1bZGVzdC5zbGljZSgtMSldO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dG9rZW5EZXN0ID0gJyc7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dG9rZW5EZXN0ID0gJy0nO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKGRlc3Quc2xpY2UoLTEpID09PSAnZScgJiYgdG9rZW5EZXN0WzBdID09PSAnaScpIHtcblx0XHRcdFx0dG9rZW5EZXN0ID0gdG9rZW5EZXN0LnNsaWNlKDEpO1xuXG5cdFx0XHRcdGlmIChjb25maWdbJ+OBiOOBhCddID09PSAnZWknKSB7XG5cdFx0XHRcdFx0ZGVzdCArPSAnaSc7XG5cdFx0XHRcdH0gZWxzZSBpZiAoY29uZmlnWyfjgYjjgYQnXSA9PT0gJ2VlJykge1xuXHRcdFx0XHRcdGRlc3QgKz0gJ2UnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGNvbmZpZ1sn44GI44GEJ10gPT09ICdlaCcpIHtcblx0XHRcdFx0XHRkZXN0ICs9ICdoJztcblx0XHRcdFx0fSBlbHNlIGlmIChjb25maWdbJ+OBiOOBhCddID09PSAnw6onKSB7XG5cdFx0XHRcdFx0ZGVzdCA9IGRlc3Quc2xpY2UoMCwgLTEpICsgJ8OqJztcblx0XHRcdFx0fSBlbHNlIGlmIChjb25maWdbJ+OBiOOBhCddID09PSAnxJMnKSB7XG5cdFx0XHRcdFx0ZGVzdCA9IGRlc3Quc2xpY2UoMCwgLTEpICsgJ8STJztcblx0XHRcdFx0fSBlbHNlIGlmIChjb25maWdbJ+OBiOOBhCddID09PSAnZScpIHtcblx0XHRcdFx0XHQvLyBub3BlXG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoZGVzdC5zbGljZSgtMSkgPT09ICdvJyAmJiB0b2tlbkRlc3RbMF0gPT09ICd1Jykge1xuXHRcdFx0XHRcdHRva2VuRGVzdCA9IHRva2VuRGVzdC5zbGljZSgxKTtcblxuXHRcdFx0XHRcdGlmIChjb25maWdbJ+OBiuOBhiddID09PSAnb3UnKSB7XG5cdFx0XHRcdFx0XHRkZXN0ICs9ICd1Jztcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGNvbmZpZ1sn44GK44GGJ10gPT09ICdvbycpIHtcblx0XHRcdFx0XHRcdGRlc3QgKz0gJ28nO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoY29uZmlnWyfjgYrjgYYnXSA9PT0gJ29oJykge1xuXHRcdFx0XHRcdFx0ZGVzdCArPSAnaCc7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChjb25maWdbJ+OBiuOBhiddID09PSAnw7QnKSB7XG5cdFx0XHRcdFx0XHRkZXN0ID0gZGVzdC5zbGljZSgwLCAtMSkgKyAnw7QnO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoY29uZmlnWyfjgYrjgYYnXSA9PT0gJ8WNJykge1xuXHRcdFx0XHRcdFx0ZGVzdCA9IGRlc3Quc2xpY2UoMCwgLTEpICsgJ8WNJztcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGNvbmZpZ1sn44GK44GGJ10gPT09ICdvJykge1xuXHRcdFx0XHRcdFx0Ly8gbm9wZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChkZXN0Lm1hdGNoKC9bYWl1ZW9dJC8pICYmIGRlc3Quc2xpY2UoLTEpID09PSB0b2tlbkRlc3RbMF0gJiYgdG9rZW4gIT09ICfjgpInKSB7XG5cdFx0XHRcdFx0XHR0b2tlbkRlc3QgPSB0b2tlbkRlc3Quc2xpY2UoMSk7XG5cblx0XHRcdFx0XHRcdGRlc3QgPSBkZXN0LnNsaWNlKDAsIC0xKSArIGNvbmZpZ1t7XG5cdFx0XHRcdFx0XHRcdCdhJzogJ+OBguOBgicsXG5cdFx0XHRcdFx0XHRcdCdpJzogJ+OBhOOBhCcsXG5cdFx0XHRcdFx0XHRcdCd1JzogJ+OBhuOBhicsXG5cdFx0XHRcdFx0XHRcdCdlJzogJ+OBiOOBiCcsXG5cdFx0XHRcdFx0XHRcdCdvJzogJ+OBiuOBiidcblx0XHRcdFx0XHRcdH1bZGVzdC5zbGljZSgtMSldXTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdC8vIOOCk+OBsFxuXHRcdFx0aWYgKHRva2VuRGVzdC5tYXRjaCgvXlticG1dLykgJiYgcHJldmlvdXNUb2tlbiA9PT0gJ+OCkycpIHtcblx0XHRcdFx0aWYgKGNvbmZpZ1sn44KT44GwJ10gPT09ICduYmEnKSB7XG5cdFx0XHRcdFx0Ly8gbm9wZVxuXHRcdFx0XHR9IGVsc2UgaWYgKGNvbmZpZ1sn44KT44GwJ10gPT09ICdtYmEnKSB7XG5cdFx0XHRcdFx0XHRkZXN0ID0gZGVzdC5zbGljZSgwLCAtMSkgKyAnbSc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyDjgpPjgYJcblx0XHRcdGlmICh0b2tlbkRlc3QubWF0Y2goL15bYWl1ZW95XS8pICYmIHByZXZpb3VzVG9rZW4gPT09ICfjgpMnKSB7XG5cdFx0XHRcdGlmIChjb25maWdbJ+OCk+OBgiddID09PSAnbmEnKSB7XG5cdFx0XHRcdFx0Ly8gbm9wZVxuXHRcdFx0XHR9IGVsc2UgaWYgKGNvbmZpZ1sn44KT44GCJ10gPT09ICduXFwnYScpIHtcblx0XHRcdFx0XHRcdHRva2VuRGVzdCA9ICdcXCcnICsgdG9rZW5EZXN0O1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoY29uZmlnWyfjgpPjgYInXSA9PT0gJ24tYScpIHtcblx0XHRcdFx0XHRcdHRva2VuRGVzdCA9ICctJyArIHRva2VuRGVzdDtcblx0XHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjb25maWcucHVuY3R1YXRpb24gJiYgamFwYW5lc2Uucm9tYW5pemVQdW5jdXR1YXRpb25UYWJsZVt0b2tlbl0pIHtcblx0XHRcdFx0dG9rZW5EZXN0ID0gamFwYW5lc2Uucm9tYW5pemVQdW5jdXR1YXRpb25UYWJsZVt0b2tlbl07XG5cdFx0XHR9XG5cblx0XHRcdGRlc3QgKz0gdG9rZW5EZXN0O1xuXG5cdFx0XHRwcmV2aW91c1Rva2VuID0gdG9rZW47XG5cdFx0fVxuXG5cdFx0aWYgKHByZXZpb3VzVG9rZW4gPT09ICfjgaMnKSB7XG5cdFx0XHRkZXN0ICs9ICdcXCcnO1xuXHRcdH1cblxuXHRcdHJldHVybiBkZXN0O1xuXHR9O1xufTsiXX0=
