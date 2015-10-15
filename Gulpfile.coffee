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
	.pipe jshint.reporter 'default'

gulp.task 'build', ->
	browserify 'browser.js'
	.transform babelify
	.bundle()
	.pipe sourceStream 'japanese.js'
	.pipe gulp.dest 'build'

gulp.task 'test-node', ->
	gulp.src 'test/*.js', read: false
	.pipe mocha reporter: 'spec'

gulp.task 'default', ['test-static', 'build', 'test-node']
