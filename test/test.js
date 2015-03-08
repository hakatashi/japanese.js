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

	it('must keep non-japanese strings untouched', function () {
		japanese.katakanize('Chocolate').should.be.exactly('Chocolate');
		japanese.katakanize('Tiramisù').should.be.exactly('Tiramisù');
		japanese.katakanize('пряник').should.be.exactly('пряник');
		japanese.katakanize('ฝอยทอง').should.be.exactly('ฝอยทอง');
		japanese.katakanize('龜苓膏').should.be.exactly('龜苓膏');
	});
});

describe('japanese.romanize()', function () {
	describe('Wikipedia-style mode', function () {
		it('must perfectly convert existing Wikipedia articles', function () {
			japanese.romanize('れんあい').should.be.exactly('ren\'ai');

			japanese.romanize('ほっかいどう').should.be.exactly('hokkaidō');
			japanese.romanize('あおもり').should.be.exactly('aomori');
			japanese.romanize('いわて').should.be.exactly('iwate');
			japanese.romanize('あきた').should.be.exactly('akita');
			japanese.romanize('やまがた').should.be.exactly('yamagata');
			japanese.romanize('ふくしま').should.be.exactly('fukushima');
			japanese.romanize('いばらき').should.be.exactly('ibaraki');
			japanese.romanize('とちぎ').should.be.exactly('tochigi');
			japanese.romanize('ぐんま').should.be.exactly('gunma');
			japanese.romanize('さいたま').should.be.exactly('saitama');
			japanese.romanize('ちば').should.be.exactly('chiba');
			japanese.romanize('とうきょう').should.be.exactly('tōkyō');
			japanese.romanize('かながわ').should.be.exactly('kanagawa');
			japanese.romanize('にいがた').should.be.exactly('niigata');
			japanese.romanize('とやま').should.be.exactly('toyama');
			japanese.romanize('いしかわ').should.be.exactly('ishikawa');
			japanese.romanize('ふくい').should.be.exactly('fukui');
			japanese.romanize('やまなし').should.be.exactly('yamanashi');
			japanese.romanize('ながの').should.be.exactly('nagano');
			japanese.romanize('ぎふ').should.be.exactly('gifu');
			japanese.romanize('しずおか').should.be.exactly('shizuoka');
			japanese.romanize('あいち').should.be.exactly('aichi');
			japanese.romanize('みえ').should.be.exactly('mie');
			japanese.romanize('しが').should.be.exactly('shiga');
			japanese.romanize('きょうと').should.be.exactly('kyōto');
			japanese.romanize('おおさか').should.be.exactly('ōsaka');
			japanese.romanize('ひょうご').should.be.exactly('hyōgo');
			japanese.romanize('なら').should.be.exactly('nara');
			japanese.romanize('わかやま').should.be.exactly('wakayama');
			japanese.romanize('とっとり').should.be.exactly('tottori');
			japanese.romanize('しまね').should.be.exactly('shimane');
			japanese.romanize('おかやま').should.be.exactly('okayama');
			japanese.romanize('ひろしま').should.be.exactly('hiroshima');
			japanese.romanize('やまぐち').should.be.exactly('yamaguchi');
			japanese.romanize('とくしま').should.be.exactly('tokushima');
			japanese.romanize('かがわ').should.be.exactly('kagawa');
			japanese.romanize('えひめ').should.be.exactly('ehime');
			japanese.romanize('こうち').should.be.exactly('kōchi');
			japanese.romanize('ふくおか').should.be.exactly('fukuoka');
			japanese.romanize('さが').should.be.exactly('saga');
			japanese.romanize('ながさき').should.be.exactly('nagasaki');
			japanese.romanize('くまもと').should.be.exactly('kumamoto');
			japanese.romanize('おおいた').should.be.exactly('ōita');
			japanese.romanize('みやざき').should.be.exactly('miyazaki');
			japanese.romanize('かごしま').should.be.exactly('kagoshima');
			japanese.romanize('おきなわ').should.be.exactly('okinawa');
		});

		// http://en.wikipedia.org/wiki/List_of_Strawberry_Panic!_characters
		it('must kind-hearted for fans of Strawberry Panic!', function () {
			japanese.romanize('あおい なぎさ').should.be.exactly('aoi nagisa');
			japanese.romanize('はなぞの しずま').should.be.exactly('hanazono shizuma');
			japanese.romanize('すずみ たまお').should.be.exactly('suzumi tamao');
			japanese.romanize('ろくじょう みゆき').should.be.exactly('rokujō miyuki');
			japanese.romanize('つきだて ちよ').should.be.exactly('tsukidate chiyo');
			japanese.romanize('さくらぎ かおり').should.be.exactly('sakuragi kaori');
			// Original: Sisutā Hamasaka Mizue ...which maybe typo
			japanese.romanize('しすたー はまさか みずえ').should.be.exactly('shisutā hamasaka mizue');
			japanese.romanize('このはな ひかり').should.be.exactly('konohana hikari');
			japanese.romanize('なんと やや').should.be.exactly('nanto yaya');
			japanese.romanize('おおとり あまね').should.be.exactly('ōtori amane');
			japanese.romanize('おくわか つぼみ').should.be.exactly('okuwaka tsubomi');
			japanese.romanize('とうもり しおん').should.be.exactly('tōmori shion');
			japanese.romanize('けんじょう かなめ').should.be.exactly('kenjō kaname');
			japanese.romanize('きやしき ももみ').should.be.exactly('kiyashiki momomi');
			japanese.romanize('みなもと ちかる').should.be.exactly('minamoto chikaru');
			japanese.romanize('ひゅうが きずな').should.be.exactly('hyūga kizuna');
			japanese.romanize('なつめ れもん').should.be.exactly('natsume remon');
			japanese.romanize('びゃくだん かごめ').should.be.exactly('byakudan kagome');
		});

		it('should be able to convert some strange japanese strings neatly', function () {
			japanese.romanize('アッーウッウッイネイネ').should.be.exactly('a\'-u\'u\'ineine');
			japanese.romanize('ウッウッーウマウマ').should.be.exactly('u\'u\'-umauma');
			japanese.romanize('ムッムッホァイ').should.be.exactly('mummuhhoai');
			japanese.romanize('うっうー').should.be.exactly('u\'ū');
			japanese.romanize('ッエーイ☆').should.be.exactly('\'ēi');
			japanese.romanize('おっおっおっ').should.be.exactly('o\'o\'o\'');
			japanese.romanize('はっやーい').should.be.exactly('hayyāi');
			japanese.romanize('おっそーい').should.be.exactly('ossōi');
			japanese.romanize('ンアッー!').should.be.exactly('n\'a\'-');
			japanese.romanize('ダァシエリイェス').should.be.exactly('daashieriyesu');
			japanese.romanize('ガールズパンツァー').should.be.exactly('gāruzupantsā');
			japanese.romanize('キェェェェェェアァァァァァァシャァベッタァァァァァァァ').should.be.exactly('kyeeeeeeaaaaaaashaabettaaaaaaaa');
			japanese.romanize('ぶっぽるぎゃるぴるぎゃっぽっぱぁーっ！').should.be.exactly('bupporugyarupirugyappoppaā\'');
		});
	});

	describe('Kunrei-shiki mode', function () {
		it('must perfectly convert ISO 3602 provided examples', function () {
			japanese.romanize('かのう', 'kunrei').should.be.exactly('kanô');
			japanese.romanize('かんおう', 'kunrei').should.be.exactly('kan\'ô');
			japanese.romanize('きにゅう', 'kunrei').should.be.exactly('kinyû');
			japanese.romanize('きんゆう', 'kunrei').should.be.exactly('kin\'yû');

			japanese.romanize('がっこう', 'kunrei').should.be.exactly('gakkô');

			japanese.romanize('カー', 'kunrei').should.be.exactly('kâ');
			japanese.romanize('ビール', 'kunrei').should.be.exactly('bîru');
			japanese.romanize('ソース', 'kunrei').should.be.exactly('sôsu');

			japanese.romanize('おかあさん', 'kunrei').should.be.exactly('okâsan');
			japanese.romanize('くうき', 'kunrei').should.be.exactly('kûki');
			japanese.romanize('おとうさん', 'kunrei').should.be.exactly('otôsan');
			japanese.romanize('ねえさん', 'kunrei').should.be.exactly('nêsan');

			japanese.romanize('こうぎょう', 'kunrei').should.be.exactly('kôgyô');
			japanese.romanize('みょうじ', 'kunrei').should.be.exactly('myôzi');
			japanese.romanize('しょうひょう', 'kunrei').should.be.exactly('syôhyô');
			japanese.romanize('りゅうこう', 'kunrei').should.be.exactly('ryûkô');
			japanese.romanize('ちゅうい', 'kunrei').should.be.exactly('tyûi');
			japanese.romanize('ひょうじょう', 'kunrei').should.be.exactly('hyôzyô');
			japanese.romanize('ぎゅうにゅう', 'kunrei').should.be.exactly('gyûnyû');
			japanese.romanize('はっぴょう', 'kunrei').should.be.exactly('happyô');
		});

		it('must convert sensitive... ISO 3602 Strict related strings correctly', function () {
			japanese.romanize('はなぢ', 'kunrei').should.be.exactly('hanazi');
			japanese.romanize('ちぢみ', 'kunrei').should.be.exactly('tizimi');
			japanese.romanize('あいづ', 'kunrei').should.be.exactly('aizu');
			japanese.romanize('つづきもの', 'kunrei').should.be.exactly('tuzukimono');

			japanese.romanize('でんぢゃらす', 'kunrei').should.be.exactly('denzyarasu');
			japanese.romanize('まんぢゅう', 'kunrei').should.be.exactly('manzyû');
			japanese.romanize('はなぢょうちん', 'kunrei').should.be.exactly('hanazyôtin');

			japanese.romanize('くうぼをきゅう', 'kunrei').should.be.exactly('kûbookyû');
		});
	});
});
