/* jslint browser: true */

(function() {
  var global;

  if (process.browser) {
    global = window;
  }

  global.japanese = require('./');

}).call(this);
