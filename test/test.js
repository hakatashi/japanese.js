/*global describe, it */
'use strict';
var assert = require('assert');
var japanese = require('../');

describe('japanese node module', function () {
  it('must have at least one test', function () {
    japanese();
    assert(false, 'I was too lazy to write any tests. Shame on me.');
  });
});
