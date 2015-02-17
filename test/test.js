/*global describe, it */
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
        japanese.hiraganize('フェレロ・ロシェ').should.be.exactly('ふぃれろ・ろしぇ');
        japanese.hiraganize('あんドーナツ').should.be.exactly('あんどーなつ');
        japanese.hiraganize('抹茶アイス').should.be.exactly('抹茶あいす');
        japanese.hiraganize('牛乳プリン').should.be.exactly('牛乳ぷりん');
        japanese.hiraganize('リコリス菓子').should.be.exactly('りこりす菓子');
    });

    it('must perfectly convert strange katakana string into hiragana', function () {
        japanese.hiraganize('ビスコッティ・サヴォイアルディ').should.be.exactly('びすこってぃ・さゔぉいあるでぃ');
        japanese.hiraganize('ヴァレニエ').should.be.exactly('ゔぁれにえ');
        japanese.hiraganize('ヱヴァンゲリヲン').should.be.exactly('ゑゔぁんげりをん');
        japanese.hiraganize('チヨコバナヽ').should.be.exactly('ちよこばなゝ');
        japanese.hiraganize('バヾヘラアイス').should.be.exactly('ばゞへらあいす');
    });

    it('must convert unconvertable katakanaes using combining characters', function () {
        japanese.hiraganize('ヸヨロン').should.be.exactly('ゐ゙よろん');
        japanese.hiraganize('ヹルタースオリジナル').should.be.exactly('ゑ゙るたーすおりじなる');
    });
});
