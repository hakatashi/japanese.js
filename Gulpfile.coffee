gulp = require 'gulp'
browserify = require 'browserify'
babelify = require 'babelify'
jshint = require 'gulp-jshint'
mocha = require 'gulp-mocha'
mochaPhantom = require 'gulp-mocha-phantomjs'
sourceStream = require 'vinyl-source-stream'

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

gulp.task 'test', ['test-static', 'test-node']

gulp.task 'default', ['test']
