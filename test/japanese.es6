/* global window */

// This module automatically detects whether this script is running on node
// and export suitable japanese module

// Browser
if (process.browser) {
	module.exports = window.japanese;
}
// Node
else {
	module.exports = require('../');
}
