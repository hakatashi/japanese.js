/* global describe, xdescribe, it */
'use strict';

const should = require('should');
const japanese = require('../');

// Compatify Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER
const MAX_SAFE_INTEGER = 9007199254740991;
const MIN_SAFE_INTEGER = -9007199254740991;

describe('japanese.transcribeNumber()', () => {
	describe('default options', () => {
		it('must perfectly transcribe some numbers and strings into japanese', () => {
			japanese.transcribeNumber(0).should.be.exactly('〇');
			japanese.transcribeNumber(4).should.be.exactly('四');
			japanese.transcribeNumber(13).should.be.exactly('十三');
			japanese.transcribeNumber(334).should.be.exactly('三百三十四');
			japanese.transcribeNumber(2525).should.be.exactly('二千五百二十五');
			japanese.transcribeNumber(810100081).should.be.exactly('八億千十万八十一');
			japanese.transcribeNumber(3000000000000).should.be.exactly('三兆');
			japanese.transcribeNumber('8').should.be.exactly('八');
			japanese.transcribeNumber('72').should.be.exactly('七十二');
			japanese.transcribeNumber('52149').should.be.exactly('五万二千百四十九');
			japanese.transcribeNumber('114514').should.be.exactly('十一万四千五百十四');
			japanese.transcribeNumber('241543903').should.be.exactly('二億四千百五十四万三千九百三');
		});

		it('must perfectly convert some huge numbers into japanese until 無量大数', () => {
			// Number.MAX_SAFE_INTEGER
			japanese.transcribeNumber(MAX_SAFE_INTEGER).should.be.exactly([
				'九千七兆',
				'千九百九十二億',
				'五千四百七十四万',
				'九百九十一'
			].join(''));
			// https://ja.wikipedia.org/wiki/18446744073709551617
			japanese.transcribeNumber('18446744073709551617').should.be.exactly([
				'千八百四十四京',
				'六千七百四十四兆',
				'七百三十七億',
				'九百五十五万',
				'千六百十七'
			].join(''));
			// http://dic.nicovideo.jp/a/9999999999999999999999999999999999999999999999999999999999999999
			japanese.transcribeNumber('9999999999999999999999999999999999999999999999999999999999999999').should.be.exactly([
				'九千九百九十九那由他',
				'九千九百九十九阿僧祇',
				'九千九百九十九恒河沙',
				'九千九百九十九極',
				'九千九百九十九載',
				'九千九百九十九正',
				'九千九百九十九澗',
				'九千九百九十九溝',
				'九千九百九十九穣',
				'九千九百九十九𥝱',
				'九千九百九十九垓',
				'九千九百九十九京',
				'九千九百九十九兆',
				'九千九百九十九億',
				'九千九百九十九万',
				'九千九百九十九',
			].join(''));
			// PI
			japanese.transcribeNumber('314159265358979323846264338327950288419716939937510582097494459230781640').should.be.exactly([
				'三千百四十一無量大数',
				'五千九百二十六不可思議',
				'五千三百五十八那由他',
				'九千七百九十三阿僧祇',
				'二千三百八十四恒河沙',
				'六千二百六十四極',
				'三千三百八十三載',
				'二千七百九十五正',
				'二百八十八澗',
				'四千百九十七溝',
				'千六百九十三穣',
				'九千九百三十七𥝱',
				'五千百五垓',
				'八千二百九京',
				'七千四百九十四兆',
				'四千五百九十二億',
				'三千七十八万',
				'千六百四十',
			].join(''));
		});

		it('should fairly transcribe numbers over 無量大数 into serialized numbers', () => {
			// Number.MAX_VALUE is exactly the same as 2 ** 1024 - 2 ** 971
			japanese.transcribeNumber(Number.MAX_VALUE).should.be.exactly([
				'一七九七六九三',
				'一三四八六二三一五七',
				'〇八一四五二七四二三',
				'七三一七〇四三五六七',
				'九八〇七〇五六七五二',
				'五八四四九九六五九八',
				'九一七四七六八〇三一',
				'五七二六〇七八〇〇二',
				'八五三八七六〇五八九',
				'五五八六三二七六六八',
				'七八一七一五四〇四五',
				'八九五三五一四三八二',
				'四六四二三四三二一三',
				'二六八八九四六四一八',
				'二七六八四六七五四六',
				'七〇三五三七五一六九',
				'八六〇四九九一〇五七',
				'六五五一二八二〇七六',
				'二四五四九〇〇九〇三',
				'八九三二八九四四〇七',
				'五八六八五〇八四五五',
				'一三三九四二三〇四五',
				'八三二三六九〇三二二',
				'二九四八一六五八〇八',
				'五千五百九十三無量大数',
				'三千二百十二不可思議',
				'三千三百四十八那由他',
				'二千七百四十七阿僧祇',
				'九千七百八十二恒河沙',
				'六千二百四極',
				'千四百四十七載',
				'二千三百十六正',
				'八千七百三十八澗',
				'千七百七十一溝',
				'八千九十一穣',
				'九千二百九十九𥝱',
				'八千八百十二垓',
				'五千四十京',
				'四千二十六兆',
				'千八百四十一億',
				'二千四百八十五万',
				'八千三百六十八',
			].join(''));

			// gooprol
			japanese.transcribeNumber([
				'1',
				'0000000000',
				'0000000000',
				'0000000000',
				'0000000000',
				'0000000000',
				'0000000000',
				'0000000000',
				'0000000000',
				'0000000000',
				'0000000267',
			].join('')).should.be.exactly([
				'一〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'千無量大数二百六十七',
			].join(''));
		});

		it.skip('must perfectly transcribe negative numbers with facing "マイナス" string', () => {
			japanese.transcribeNumber(-0).should.be.exactly('マイナス〇');
			japanese.transcribeNumber(-1).should.be.exactly('マイナス一');
			japanese.transcribeNumber(-893).should.be.exactly('マイナス八百九十三');
			japanese.transcribeNumber('-0').should.be.exactly('マイナス〇');
			japanese.transcribeNumber('-1').should.be.exactly('マイナス一');
			japanese.transcribeNumber('-114514').should.be.exactly('マイナス十一万四千五百十四');
		});

		it.skip('must perfectly transcribe very minor numbers into string', () => {
			// Number.MIN_SAFE_INTEGER
			japanese.transcribeNumber(MIN_SAFE_INTEGER).should.be.exactly([
				'マイナス',
				'九千七兆',
				'千九百九十二億',
				'五千四百七十四万',
				'九百九十一',
			]);

			// PI
			japanese.transcribeNumber('-314159265358979323846264338327950288419716939937510582097494459230781640').should.be.exactly([
				'マイナス',
				'三千百四十一無量大数',
				'五千九百二十六不可思議',
				'五千三百五十八那由多',
				'九千七百九十三阿僧祇',
				'二千三百八十四恒河沙',
				'六千二百六十四極',
				'三千三百八十三載',
				'二千七百九十五正',
				'二百八十八澗',
				'四千百九十七溝',
				'千六百九十三穣',
				'九千九百三十七𥝱',
				'五千百五垓',
				'八千二百九京',
				'七千四百九十四兆',
				'四千五百九十二億',
				'三千七十八万',
				'千六百四十',
			].join(''));

			japanese.transcribeNumber(-Number.MAX_VALUE).should.be.exactly([
				'マイナス',
				'一七九七六九三',
				'一三四八六二三一五七',
				'〇八一四五二七四二三',
				'七三一七〇四三五六七',
				'九八〇七〇五六七五二',
				'五八四四九九六五九八',
				'九一七四七六八〇三一',
				'五七二六〇七八〇〇二',
				'八五三八七六〇五八九',
				'五五八六三二七六六八',
				'七八一七一五四〇四五',
				'八九五三五一四三八二',
				'四六四二三四三二一三',
				'二六八八九四六四一八',
				'二七六八四六七五四六',
				'七〇三五三七五一六九',
				'八六〇四九九一〇五七',
				'六五五一二八二〇七六',
				'二四五四九〇〇九〇三',
				'八九三二八九四四〇七',
				'五八六八五〇八四五五',
				'一三三九四二三〇四五',
				'八三二三六九〇三二二',
				'二九四八一六五八〇八',
				'五千五百九十三無量大数',
				'三千二百十二不可思議',
				'三千三百四十八那由多',
				'二千七百四十七阿僧祇',
				'九千七百八十二恒河沙',
				'六千二百四極',
				'千四百四十七載',
				'二千三百十六正',
				'八千七百三十八澗',
				'千七百七十一溝',
				'八千九十一穣',
				'九千二百九十九𥝱',
				'八千八百十二垓',
				'五千四十京',
				'四千二十六兆',
				'千八百四十一億',
				'二千四百八十五万',
				'八千三百六十八',
			].join(''));
		});

		it.skip('must perfectly transcribe decimal fractions with fullwidth dot sign', () => {
			japanese.transcribeNumber(3.14).should.be.exactly('三・一四');
			japanese.transcribeNumber(249.51).should.be.exactly('二百四十九・五一');
			japanese.transcribeNumber(802.11).should.be.exactly('八百二・一一');
			japanese.transcribeNumber(-1995.117).should.be.exactly('マイナス千九百九十五・一一七');
			japanese.transcribeNumber('1.41421356').should.be.exactly('一・四一四二一三五六');
			japanese.transcribeNumber('.721454545454545454545454545')
				.should.be.exactly('〇・七二一四五四五四五四五四五四五四五四五四五四五四五四五');
		});

		it.skip('must have JavaScript oriented precisions for decimal fractions', () => {
			japanese.transcribeNumber(1 / 3)
				.should.be.exactly('〇・三三三三三三三三三三三三三三三三');
			japanese.transcribeNumber(0.1 + 0.2)
				.should.be.exactly('〇・三〇〇〇〇〇〇〇〇〇〇〇〇〇〇〇四');
			japanese.transcribeNumber(1 / 5554560721)
				.should.be.exactly('〇・〇〇〇〇〇〇〇〇〇一八〇〇三二二三八四一二五三九六二');
			japanese.transcribeNumber(1234567890.1234567890123456789)
				.should.be.exactly('十二億三千四百五十六万七千八百九十・一二三四五六七');
			japanese.transcribeNumber(Number.MIN_VALUE).should.be.exactly([
				'〇・',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇〇〇〇〇〇〇〇',
				'〇〇〇五',
			].join(''));
		});

		it.skip('must transcribe each occurrence of number in string', () => {
			japanese.transcribeNumber('2.26事件').should.be.exactly('二・二六事件');
			japanese.transcribeNumber('2-4-11').should.be.exactly('二マイナス四マイナス十一');
			japanese.transcribeNumber('50歩100歩').should.be.exactly('五十歩百歩');
			japanese.transcribeNumber('6000000000000年と1夜物語').should.be.exactly('六兆年と一夜物語');
			japanese.transcribeNumber('毎秒2億9979万2458メートル')
				.should.be.exactly('毎秒二億九千九百七十九万二千四百五十八メートル');
		});

		it.skip('must transcribe comma separated number strings', () => {
			japanese.transcribeNumber('1,234,567.89')
				.should.be.exactly('百二十三万四千五百六十七・八九');
			japanese.transcribeNumber('1,2,34,5,6,7.89')
				.should.be.exactly('百二十三万四千五百六十七・八九');
		});

		it.skip('mustn\'t include comma inside of fraction part as number', () => {
			japanese.transcribeNumber('1,234,567.890,123,456')
				.should.be.exactly('百二十三万四千五百六十七・八九〇,十二万三千四百五十六');
		});

		it.skip('must convert special numbers into string but not ones in the strings', () => {
			japanese.transcribeNumber(NaN).should.be.exactly('非数');
			japanese.transcribeNumber(Infinity).should.be.exactly('無限大');
			japanese.transcribeNumber(-Infinity).should.be.exactly('マイナス無限大');
			japanese.transcribeNumber('NaN').should.be.exactly('NaN');
			japanese.transcribeNumber('Infinity').should.be.exactly('Infinity');
			japanese.transcribeNumber('-Infinity').should.be.exactly('-Infinity');
		});
	});
});
