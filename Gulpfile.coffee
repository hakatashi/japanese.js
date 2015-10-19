gulp = require 'gulp'
browserify = require 'browserify'
babelify = require 'babelify'
jshint = require 'gulp-jshint'
mocha = require 'gulp-spawn-mocha'
uglify = require 'gulp-uglify'
rename = require 'gulp-rename'
header = require 'gulp-header'
mochaPhantom = require 'gulp-mocha-phantomjs'
babel = require 'gulp-babel'
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
	gulp.src ['*.js', 'src/*.es6', 'test/*.es6', '!test/browser.js']
	.pipe jshint()
	.pipe jshint.reporter 'jshint-stylish'
	.pipe jshint.reporter 'fail'

gulp.task 'build-node', ->
	gulp.src ['src/*.es6', 'test/*.es6'], base: '.'
	.pipe babel()
	.pipe rename (file) -> file.extname = '.js'
	.pipe gulp.dest '.'

gulp.task 'build-browser', ->
	browserify
		entries: 'browser.js'
		debug: true
		transform: [babelify]
		extensions: ['.es6', '.js']
	.bundle (error) -> console.error(error) if error
	.pipe sourceStream 'japanese.js'
	.pipe gulp.dest 'build'

gulp.task 'build-test', ->
	browserify
		entries: 'test/index.js'
		debug: true
		transform: [babelify]
		extensions: ['.es6', '.js']
	.bundle (error) -> console.error(error) if error
	.pipe sourceStream 'browser.js'
	.pipe gulp.dest 'test'

gulp.task 'test-node', ['build-node'], ->
	gulp.src 'test/index.js', read: false
	.pipe mocha reporter: 'spec'

gulp.task 'test-browser', ['build-test'], ->
	gulp.src 'test/index.html', read: false
	.pipe mochaPhantom reporter: 'spec'

gulp.task 'dist', ['build-node', 'build-browser'], ->
	gulp.src 'build/japanese.js'
	.pipe header banner, pkg: require './package.json'
	.pipe gulp.dest 'dist'
	.pipe uglify preserveComments: 'license'
	.pipe rename (file) -> file.extname = '.min.js'
	.pipe gulp.dest 'dist'

gulp.task 'test', ['test-static', 'test-browser', 'test-node']

gulp.task 'default', ['test']
