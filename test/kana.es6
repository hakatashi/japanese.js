/* global describe, it */
'use strict';

var should = require('should');
var japanese = require('../');

describe('japanese.hiraganize()', function () {
	it('must perfectly convert given katakana into hiragana', function () {
		japanese.hiraganize('モンブラン').should.be.exactly('もんぶらん');
		japanese.hiraganize('ティラミス').should.be.exactly('てぃらみす');
		japanese.hiraganize('ジェラート').should.be.exactly('じぇらーと');
		japanese.hiraganize('セミフレッド').should.be.exactly('せみふれっど');
		japanese.hiraganize('パンナコッタ').should.be.exactly('ぱんなこった');
	});

	it('must perfectly convert katakana-mixed string into hiragana', function () {
		japanese.hiraganize('フェレロ・ロシェ').should.be.exactly('ふぇれろ・ろしぇ');
		japanese.hiraganize('あんドーナツ').should.be.exactly('あんどーなつ');
		japanese.hiraganize('抹茶アイス').should.be.exactly('抹茶あいす');
		japanese.hiraganize('牛乳プリン').should.be.exactly('牛乳ぷりん');
		japanese.hiraganize('リコリス菓子').should.be.exactly('りこりす菓子');
	});

	it('must perfectly convert strange katakana string into hiragana', function () {
		japanese.hiraganize('バクラヴァ').should.be.exactly('ばくらゔぁ');
		japanese.hiraganize('ヴァレニエ').should.be.exactly('ゔぁれにえ');
		japanese.hiraganize('ヱヴァンゲリヲン').should.be.exactly('ゑゔぁんげりをん');
		japanese.hiraganize('チヨコバナヽ').should.be.exactly('ちよこばなゝ');
		japanese.hiraganize('バヾヘラアイス').should.be.exactly('ばゞへらあいす');
	});

	it('must convert unconvertable voiced katakanaes using combining characters', function () {
		japanese.hiraganize('ヸヨロン').should.be.exactly('ゐ゙よろん');
		japanese.hiraganize('ヹルタースオリジナル').should.be.exactly('ゑ゙るたーすおりじなる');
		japanese.hiraganize('シユヷルツヹルダーキルシユトルテ').should.be.exactly('しゆわ゙るつゑ゙るだーきるしゆとるて');
		japanese.hiraganize('ビスコツテイサヺイアルデイ').should.be.exactly('びすこつていさを゙いあるでい');
		japanese.hiraganize('ルートヸヒシユトルヹルク').should.be.exactly('るーとゐ゙ひしゆとるゑ゙るく');
	});

	it('must convert katakana digraphs into separated hiraganaes', function () {
		japanese.hiraganize('オ菓子ヲ食スヿコレ快ナリ').should.be.exactly('お菓子を食すことこれ快なり');
		japanese.hiraganize('板垣死ス𪜈オ菓子ハ死セズ').should.be.exactly('板垣死すともお菓子は死せず');
		japanese.hiraganize('食エ𪜈゙食エ𪜈゙オ菓子ノ山').should.be.exactly('食えども食えどもお菓子の山');
	});

	it('must convert Unicoode Kana Supplement characters', function () {
		japanese.hiraganize('𛀀クレア').should.be.exactly('えくれあ');
	});

	it('must transfer unconvertable small katakanaes into big hiragana', function () {
		japanese.hiraganize('ァィㇲㇰㇼィㇺ').should.be.exactly('ぁぃすくりぃむ');
	});

	it('must keep small-ka and small-ke untouched', function () {
		japanese.hiraganize('どら焼 3ヶ入').should.be.exactly('どら焼 3ヶ入');
		japanese.hiraganize('一ヵ月のダイエット').should.be.exactly('一ヵ月のだいえっと');
	});

	it('must keep non-japanese strings untouched', function () {
		japanese.hiraganize('Chocolate').should.be.exactly('Chocolate');
		japanese.hiraganize('Tiramisù').should.be.exactly('Tiramisù');
		japanese.hiraganize('пряник').should.be.exactly('пряник');
		japanese.hiraganize('ฝอยทอง').should.be.exactly('ฝอยทอง');
		japanese.hiraganize('龜苓膏').should.be.exactly('龜苓膏');
	});
});

describe('japanese.katakanize()', function () {
	it('must perfectly convert given hiragana into katakana', function () {
		japanese.katakanize('もんぶらん').should.be.exactly('モンブラン');
		japanese.katakanize('てぃらみす').should.be.exactly('ティラミス');
		japanese.katakanize('じぇらーと').should.be.exactly('ジェラート');
		japanese.katakanize('せみふれっど').should.be.exactly('セミフレッド');
		japanese.katakanize('ぱんなこった').should.be.exactly('パンナコッタ');
	});

	it('must perfectly convert hiragana-mixed string into katakana', function () {
		japanese.katakanize('ふぇれろ・ろしぇ').should.be.exactly('フェレロ・ロシェ');
		japanese.katakanize('あんドーナツ').should.be.exactly('アンドーナツ');
		japanese.katakanize('抹茶あいす').should.be.exactly('抹茶アイス');
		japanese.katakanize('牛乳ぷりん').should.be.exactly('牛乳プリン');
		japanese.katakanize('りこりす菓子').should.be.exactly('リコリス菓子');
	});

	it('must perfectly convert strange hiragana string into katakana', function () {
		japanese.katakanize('ばくらゔぁ').should.be.exactly('バクラヴァ');
		japanese.katakanize('ゔぁれにえ').should.be.exactly('ヴァレニエ');
		japanese.katakanize('ゑゔぁんげりをん').should.be.exactly('ヱヴァンゲリヲン');
		japanese.katakanize('ちよこばなゝ').should.be.exactly('チヨコバナヽ');
		japanese.katakanize('ばゞへらあいす').should.be.exactly('バヾヘラアイス');
	});

	it('must convert hiragana with combining characters just like normal characters', function () {
		japanese.katakanize('ゐ゙よろん').should.be.exactly('ヸヨロン');
		japanese.katakanize('ゑ゙るたーすおりじなる').should.be.exactly('ヹルタースオリジナル');
		japanese.katakanize('しゆわ゙るつゑ゙るだーきるしゆとるて').should.be.exactly('シユヷルツヹルダーキルシユトルテ');
		japanese.katakanize('びすこつていさを゙いあるでい').should.be.exactly('ビスコツテイサヺイアルデイ');
		japanese.katakanize('るーとゐ゙ひしゆとるゑ゙るく').should.be.exactly('ルートヸヒシユトルヹルク');
	});

	it('must convert katakana digraphs into separated hiraganaes', function () {
		japanese.katakanize('本日ゟかき氷解禁').should.be.exactly('本日ヨリカキ氷解禁');
	});

	it('must convert Unicoode Kana Supplement characters', function () {
		japanese.katakanize('𛀁くれあ').should.be.exactly('エクレア');
	});

	it('must keep non-japanese strings untouched', function () {
		japanese.katakanize('Chocolate').should.be.exactly('Chocolate');
		japanese.katakanize('Tiramisù').should.be.exactly('Tiramisù');
		japanese.katakanize('пряник').should.be.exactly('пряник');
		japanese.katakanize('ฝอยทอง').should.be.exactly('ฝอยทอง');
		japanese.katakanize('龜苓膏').should.be.exactly('龜苓膏');
	});
});
