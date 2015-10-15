/* jslint browser: true */

(function() {
  var global;

  if (typeof module === 'undefined') {
    global = window;
  }

  global.japanese = require('./');

}).call(this);
