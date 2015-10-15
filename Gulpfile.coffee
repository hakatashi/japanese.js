gulp = require 'gulp'
browserify = require 'browserify'
babelify = require 'babelify'
jshint = require 'gulp-jshint'
mocha = require 'gulp-mocha'
uglify = require 'gulp-uglify'
rename = require 'gulp-rename'
header = require 'gulp-header'
mochaPhantom = require 'gulp-mocha-phantomjs'
sourceStream = require 'vinyl-source-stream'

banner = """
	/**
	 * japanese.js - <%= pkg.description %>
	 * @version v<%= pkg.version %>
	 * @link <%= pkg.homepage %>
	 * @license <%= pkg.license %>
	 */

"""

gulp.task 'test-static', ->
	gulp.src ['*.js', 'src/*.js', 'test/*.js']
	.pipe jshint()
	.pipe jshint.reporter 'jshint-stylish'
	.pipe jshint.reporter 'fail'

gulp.task 'build', ->
	browserify 'browser.js'
	.transform babelify
	.bundle()
	.pipe sourceStream 'japanese.js'
	.pipe gulp.dest 'build'

gulp.task 'test-node', ['build'], ->
	gulp.src 'test/*.js', read: false
	.pipe mocha reporter: 'spec'

gulp.task 'dist', ['build'], ->
	gulp.src 'build/japanese.js'
	.pipe header banner, pkg: require './package.json'
	.pipe gulp.dest 'dist'
	.pipe uglify preserveComments: 'license'
	.pipe rename (file) -> file.extname = '.min.js'
	.pipe gulp.dest 'dist'

gulp.task 'test', ['test-static', 'test-node']

gulp.task 'default', ['test']
