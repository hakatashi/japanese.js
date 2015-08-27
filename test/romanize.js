/* global describe, it */
'use strict';

var should = require('should');
var japanese = require('../');

describe('japanese.romanize()', function () {
	it('should throw error when suspicious config was delivered', function () {
		japanese.romanize.bind(japanese, 'えらー', 'undefined config').should.throw(ReferenceError);
		japanese.romanize.bind(japanese, 'えらー', false).should.throw(Error);
		japanese.romanize.bind(japanese, 'えらー', 114514).should.throw(Error);
		japanese.romanize.bind(japanese, 'えらー', function(){}).should.throw(Error);
	});

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

	describe('Traditional Hepburn mode', function () {
		// http://en.wikipedia.org/wiki/Hepburn_romanization
		it('must perfectly convert Wikipedia\'s conversion examples', function () {
			japanese.romanize('おばあさん', 'traditional hepburn').should.be.exactly('obaasan');
			japanese.romanize('おにいさん', 'traditional hepburn').should.be.exactly('oniisan');
			japanese.romanize('おじいさん', 'traditional hepburn').should.be.exactly('ojiisan');
			japanese.romanize('おいしい', 'traditional hepburn').should.be.exactly('oishii');
			japanese.romanize('にいがた', 'traditional hepburn').should.be.exactly('niigata');
			japanese.romanize('はいいろ', 'traditional hepburn').should.be.exactly('haiiro');
			japanese.romanize('すうがく', 'traditional hepburn').should.be.exactly('sūgaku');
			japanese.romanize('ちゅうい', 'traditional hepburn').should.be.exactly('chūi');
			japanese.romanize('ぐうたら', 'traditional hepburn').should.be.exactly('gūtara');
			japanese.romanize('おねえさん', 'traditional hepburn').should.be.exactly('oneesan');
			japanese.romanize('こおり', 'traditional hepburn').should.be.exactly('kōri');
			japanese.romanize('とおまわり', 'traditional hepburn').should.be.exactly('tōmawari');
			japanese.romanize('おおさか', 'traditional hepburn').should.be.exactly('ōsaka');
			japanese.romanize('がっこう', 'traditional hepburn').should.be.exactly('gakkō');
			japanese.romanize('とうきょう', 'traditional hepburn').should.be.exactly('tōkyō');
			japanese.romanize('べんきょう', 'traditional hepburn').should.be.exactly('benkyō');
			japanese.romanize('でんぽう', 'traditional hepburn').should.be.exactly('dempō');
			japanese.romanize('きんようび', 'traditional hepburn').should.be.exactly('kin-yōbi');
			japanese.romanize('こうし', 'traditional hepburn').should.be.exactly('kōshi');
			japanese.romanize('がくせい', 'traditional hepburn').should.be.exactly('gakusei');
			japanese.romanize('けいけん', 'traditional hepburn').should.be.exactly('keiken');
			japanese.romanize('せいふく', 'traditional hepburn').should.be.exactly('seifuku');
			japanese.romanize('めい', 'traditional hepburn').should.be.exactly('mei');
			japanese.romanize('まねいて', 'traditional hepburn').should.be.exactly('maneite');
			japanese.romanize('かるい', 'traditional hepburn').should.be.exactly('karui');
			japanese.romanize('うぐいす', 'traditional hepburn').should.be.exactly('uguisu');
			japanese.romanize('おい', 'traditional hepburn').should.be.exactly('oi');
			japanese.romanize('セーラー', 'traditional hepburn').should.be.exactly('sērā');
			japanese.romanize('パーティー', 'traditional hepburn').should.be.exactly('pātī');
			japanese.romanize('レーナ', 'traditional hepburn').should.be.exactly('rēna');
			japanese.romanize('ヒーター', 'traditional hepburn').should.be.exactly('hītā');
			japanese.romanize('タクシー', 'traditional hepburn').should.be.exactly('takushī');
			japanese.romanize('スーパーマン', 'traditional hepburn').should.be.exactly('sūpāman');
			japanese.romanize('を', 'traditional hepburn').should.be.exactly('wo');
			japanese.romanize('あんない', 'traditional hepburn').should.be.exactly('annai');
			japanese.romanize('ぐんま', 'traditional hepburn').should.be.exactly('gumma');
			japanese.romanize('かんい', 'traditional hepburn').should.be.exactly('kan-i');
			japanese.romanize('しんよう', 'traditional hepburn').should.be.exactly('shin-yō');
			japanese.romanize('けっか', 'traditional hepburn').should.be.exactly('kekka');
			japanese.romanize('さっさと', 'traditional hepburn').should.be.exactly('sassato');
			japanese.romanize('ずっと', 'traditional hepburn').should.be.exactly('zutto');
			japanese.romanize('きっぷ', 'traditional hepburn').should.be.exactly('kippu');
			japanese.romanize('ざっし', 'traditional hepburn').should.be.exactly('zasshi');
			japanese.romanize('いっしょ', 'traditional hepburn').should.be.exactly('issho');
			japanese.romanize('こっち', 'traditional hepburn').should.be.exactly('kotchi');
			japanese.romanize('まっちゃ', 'traditional hepburn').should.be.exactly('matcha');
			japanese.romanize('みっつ', 'traditional hepburn').should.be.exactly('mittsu');
		});
	});

	describe('Modified Hepburn mode', function () {
		// http://en.wikipedia.org/wiki/Hepburn_romanization
		it('must perfectly convert Wikipedia\'s conversion examples', function () {
			japanese.romanize('おばあさん', 'modified hepburn').should.be.exactly('obāsan');
			japanese.romanize('おにいさん', 'modified hepburn').should.be.exactly('oniisan');
			japanese.romanize('おじいさん', 'modified hepburn').should.be.exactly('ojiisan');
			japanese.romanize('おいしい', 'modified hepburn').should.be.exactly('oishii');
			japanese.romanize('にいがた', 'modified hepburn').should.be.exactly('niigata');
			japanese.romanize('はいいろ', 'modified hepburn').should.be.exactly('haiiro');
			japanese.romanize('すうがく', 'modified hepburn').should.be.exactly('sūgaku');
			japanese.romanize('ちゅうい', 'modified hepburn').should.be.exactly('chūi');
			japanese.romanize('ぐうたら', 'modified hepburn').should.be.exactly('gūtara');
			japanese.romanize('おねえさん', 'modified hepburn').should.be.exactly('onēsan');
			japanese.romanize('こおり', 'modified hepburn').should.be.exactly('kōri');
			japanese.romanize('とおまわり', 'modified hepburn').should.be.exactly('tōmawari');
			japanese.romanize('おおさか', 'modified hepburn').should.be.exactly('ōsaka');
			japanese.romanize('がっこう', 'modified hepburn').should.be.exactly('gakkō');
			japanese.romanize('とうきょう', 'modified hepburn').should.be.exactly('tōkyō');
			japanese.romanize('べんきょう', 'modified hepburn').should.be.exactly('benkyō');
			japanese.romanize('でんぽう', 'modified hepburn').should.be.exactly('denpō');
			japanese.romanize('きんようび', 'modified hepburn').should.be.exactly('kin\'yōbi');
			japanese.romanize('こうし', 'modified hepburn').should.be.exactly('kōshi');
			japanese.romanize('がくせい', 'modified hepburn').should.be.exactly('gakusei');
			japanese.romanize('けいけん', 'modified hepburn').should.be.exactly('keiken');
			japanese.romanize('せいふく', 'modified hepburn').should.be.exactly('seifuku');
			japanese.romanize('めい', 'modified hepburn').should.be.exactly('mei');
			japanese.romanize('まねいて', 'modified hepburn').should.be.exactly('maneite');
			japanese.romanize('かるい', 'modified hepburn').should.be.exactly('karui');
			japanese.romanize('うぐいす', 'modified hepburn').should.be.exactly('uguisu');
			japanese.romanize('おい', 'modified hepburn').should.be.exactly('oi');
			japanese.romanize('セーラー', 'modified hepburn').should.be.exactly('sērā');
			japanese.romanize('パーティー', 'modified hepburn').should.be.exactly('pātī');
			japanese.romanize('レーナ', 'modified hepburn').should.be.exactly('rēna');
			japanese.romanize('ヒーター', 'modified hepburn').should.be.exactly('hītā');
			japanese.romanize('タクシー', 'modified hepburn').should.be.exactly('takushī');
			japanese.romanize('スーパーマン', 'modified hepburn').should.be.exactly('sūpāman');
			japanese.romanize('を', 'modified hepburn').should.be.exactly('o');
			japanese.romanize('あんない', 'modified hepburn').should.be.exactly('annai');
			japanese.romanize('ぐんま', 'modified hepburn').should.be.exactly('gunma');
			japanese.romanize('かんい', 'modified hepburn').should.be.exactly('kan\'i');
			japanese.romanize('しんよう', 'modified hepburn').should.be.exactly('shin\'yō');
			japanese.romanize('けっか', 'modified hepburn').should.be.exactly('kekka');
			japanese.romanize('さっさと', 'modified hepburn').should.be.exactly('sassato');
			japanese.romanize('ずっと', 'modified hepburn').should.be.exactly('zutto');
			japanese.romanize('きっぷ', 'modified hepburn').should.be.exactly('kippu');
			japanese.romanize('ざっし', 'modified hepburn').should.be.exactly('zasshi');
			japanese.romanize('いっしょ', 'modified hepburn').should.be.exactly('issho');
			japanese.romanize('こっち', 'modified hepburn').should.be.exactly('kotchi');
			japanese.romanize('まっちゃ', 'modified hepburn').should.be.exactly('matcha');
			japanese.romanize('みっつ', 'modified hepburn').should.be.exactly('mittsu');
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

	describe('Nihon-shiki mode', function () {
		it('must perfectly convert ISO 3602 provided examples', function () {
			japanese.romanize('かのう', 'nihon').should.be.exactly('kanō');
			japanese.romanize('かんおう', 'nihon').should.be.exactly('kan\'ō');
			japanese.romanize('きにゅう', 'nihon').should.be.exactly('kinyū');
			japanese.romanize('きんゆう', 'nihon').should.be.exactly('kin\'yū');

			japanese.romanize('がっこう', 'nihon').should.be.exactly('gakkō');

			japanese.romanize('カー', 'nihon').should.be.exactly('kā');
			japanese.romanize('ビール', 'nihon').should.be.exactly('bīru');
			japanese.romanize('ソース', 'nihon').should.be.exactly('sōsu');

			japanese.romanize('おかあさん', 'nihon').should.be.exactly('okāsan');
			japanese.romanize('くうき', 'nihon').should.be.exactly('kūki');
			japanese.romanize('おとうさん', 'nihon').should.be.exactly('otōsan');
			japanese.romanize('ねえさん', 'nihon').should.be.exactly('nēsan');

			japanese.romanize('こうぎょう', 'nihon').should.be.exactly('kōgyō');
			japanese.romanize('みょうじ', 'nihon').should.be.exactly('myōzi');
			japanese.romanize('しょうひょう', 'nihon').should.be.exactly('syōhyō');
			japanese.romanize('りゅうこう', 'nihon').should.be.exactly('ryūkō');
			japanese.romanize('ちゅうい', 'nihon').should.be.exactly('tyūi');
			japanese.romanize('ひょうじょう', 'nihon').should.be.exactly('hyōzyō');
			japanese.romanize('ぎゅうにゅう', 'nihon').should.be.exactly('gyūnyū');
			japanese.romanize('はっぴょう', 'nihon').should.be.exactly('happyō');
		});

		it('must convert sensitive... ISO 3602 Strict related strings correctly', function () {
			japanese.romanize('はなぢ', 'nihon').should.be.exactly('hanadi');
			japanese.romanize('ちぢみ', 'nihon').should.be.exactly('tidimi');
			japanese.romanize('あいづ', 'nihon').should.be.exactly('aidu');
			japanese.romanize('つづきもの', 'nihon').should.be.exactly('tudukimono');

			japanese.romanize('でんぢゃらす', 'nihon').should.be.exactly('dendyarasu');
			japanese.romanize('まんぢゅう', 'nihon').should.be.exactly('mandyū');
			japanese.romanize('はなぢょうちん', 'nihon').should.be.exactly('hanadyōtin');

			japanese.romanize('くうぼをきゅう', 'nihon').should.be.exactly('kūbowokyū');
		});
	});

	describe('Custom mode', function () {
		it('must perfectly convert with some strange configs', function () {
			var config = {
				'ああ': 'ah',
				'いい': 'ii',
				'うう': 'u',
				'ええ': 'eh',
				'おお': 'oh',
				'あー': 'ah',
				'えい': 'ei',
				'おう': 'ou',
				'んあ': 'na',
				'んば': 'mba',
			};

			japanese.romanize('ああむじょう', config).should.be.exactly('ahmujou');
			japanese.romanize('ボードレール', config).should.be.exactly('bohdorehru');
			japanese.romanize('なかはらちゅうや', config).should.be.exactly('nakaharachuya');
			japanese.romanize('きちがいピエロ', config).should.be.exactly('kichigaipiero');
			japanese.romanize('たにざきじゅんいちろう', config).should.be.exactly('tanizakijunichirou');
			japanese.romanize('ヴィクトル ユーゴー', config).should.be.exactly('vikutoru yuhgoh');
			japanese.romanize('うえだびん', config).should.be.exactly('uedabin');
			japanese.romanize('たんびしゅぎ', config).should.be.exactly('tambishugi');
			japanese.romanize('ゆめのきゅうさく', config).should.be.exactly('yumenokyusaku');
			japanese.romanize('いしいはくてい', config).should.be.exactly('ishiihakutei');
			japanese.romanize('モンテクリストはく', config).should.be.exactly('montekurisutohaku');
			japanese.romanize('べにすにしす', config).should.be.exactly('benisunishisu');
		});

		it('must perfectly convert with some altered configs', function () {
			var config = {
				'ああ': 'aa',
				'いい': 'ii',
				'うう': 'uu',
				'ええ': 'ee',
				'おお': 'oo',
				'あー': 'aa',
				'えい': 'ee',
				'おう': 'oo',
				'んあ': 'na',
				'んば': 'mba',
			};

			japanese.romanize('ああむじょう', config).should.be.exactly('aamujoo');
			japanese.romanize('ボードレール', config).should.be.exactly('boodoreeru');
			japanese.romanize('なかはらちゅうや', config).should.be.exactly('nakaharachuuya');
			japanese.romanize('きちがいピエロ', config).should.be.exactly('kichigaipiero');
			japanese.romanize('たにざきじゅんいちろう', config).should.be.exactly('tanizakijunichiroo');
			japanese.romanize('ヴィクトル ユーゴー', config).should.be.exactly('vikutoru yuugoo');
			japanese.romanize('うえだびん', config).should.be.exactly('uedabin');
			japanese.romanize('たんびしゅぎ', config).should.be.exactly('tambishugi');
			japanese.romanize('ゆめのきゅうさく', config).should.be.exactly('yumenokyuusaku');
			japanese.romanize('いしいはくてい', config).should.be.exactly('ishiihakutee');
			japanese.romanize('モンテクリストはく', config).should.be.exactly('montekurisutohaku');
			japanese.romanize('べにすにしす', config).should.be.exactly('benisunishisu');
		});

		it('must be properly customizable with し parameter', function () {
			japanese.romanize('しゅうごうしゃしん', {'し': 'si'}).should.be.exactly('syūgōsyasin');
			japanese.romanize('シェークスピアのしょうせつ', {'し': 'si'}).should.be.exactly('syēkusupianosyōsetsu');

			japanese.romanize('しゅうごうしゃしん', {'し': 'shi'}).should.be.exactly('shūgōshashin');
			japanese.romanize('シェークスピアのしょうせつ', {'し': 'shi'}).should.be.exactly('shēkusupianoshōsetsu');
		});

		it('must be properly customizable with ち parameter', function () {
			japanese.romanize('ちっちゃいそんちょう', {'ち': 'ti'}).should.be.exactly('titchaisontyō');
			japanese.romanize('ちゃいろいチェーン', {'ち': 'ti'}).should.be.exactly('tyairoityēn');
			japanese.romanize('テュールのティータイム', {'ち': 'ti'}).should.be.exactly('teūrunoteītaimu');

			japanese.romanize('ちっちゃいそんちょう', {'ち': 'chi'}).should.be.exactly('chitchaisonchō');
			japanese.romanize('ちゃいろいチェーン', {'ち': 'chi'}).should.be.exactly('chairoichēn');
			japanese.romanize('テュールのティータイム', {'ち': 'chi'}).should.be.exactly('tyūrunotītaimu');
		});

		it('must be properly customizable with つ parameter', function () {
			japanese.romanize('バイツァダスト', {'つ': 'tu'}).should.be.exactly('baituadasuto');
			japanese.romanize('カンツォーネ', {'つ': 'tu'}).should.be.exactly('kantuōne');
			japanese.romanize('トゥーツ・シールマンス', {'つ': 'tu'}).should.be.exactly('toūtu-shīrumansu');
			japanese.romanize('ツィゴイネルワイゼン', {'つ': 'tu'}).should.be.exactly('tuigoineruwaizen');
			japanese.romanize('ツェッペリン', {'つ': 'tu'}).should.be.exactly('tuepperin');
			japanese.romanize('ツュループィンシク', {'つ': 'tu'}).should.be.exactly('tuyurūpuinshiku');

			japanese.romanize('バイツァダスト', {'つ': 'tsu'}).should.be.exactly('baitsadasuto');
			japanese.romanize('カンツォーネ', {'つ': 'tsu'}).should.be.exactly('kantsōne');
			japanese.romanize('トゥーツ・シールマンス', {'つ': 'tsu'}).should.be.exactly('tūtsu-shīrumansu');
			japanese.romanize('ツィゴイネルワイゼン', {'つ': 'tsu'}).should.be.exactly('tsigoineruwaizen');
			japanese.romanize('ツェッペリン', {'つ': 'tsu'}).should.be.exactly('tsepperin');
			japanese.romanize('ツュループィンシク', {'つ': 'tsu'}).should.be.exactly('tsyurūpuinshiku');
		});

		it('must be properly customizable with ふ parameter', function () {
			japanese.romanize('フィファ（フェデレーション・インターナショナル・ド・フットボール・アソシエーション）のフォーメーション', {
				'ふ': 'hu'
			}).should.be.exactly('huihua(huederēshon-intānashonaru-do-huttobōru-asoshiēshon)nohuōmēshon');

			japanese.romanize('フィファ（フェデレーション・インターナショナル・ド・フットボール・アソシエーション）のフォーメーション', {
				'ふ': 'fu'
			}).should.be.exactly('fifa(federēshon-intānashonaru-do-futtobōru-asoshiēshon)nofōmēshon');
		});

		it('must be properly customizable with じ parameter', function () {
			japanese.romanize('アルジャジーラのひじょうようジェットのそうじゅう', {
				'じ': 'zi'
			}).should.be.exactly('aruzyazīranohizyōyōzyettonosōzyū');

			japanese.romanize('アルジャジーラのひじょうようジェットのそうじゅう', {
				'じ': 'ji'
			}).should.be.exactly('arujajīranohijōyōjettonosōjū');
		});

		it('must be properly customizable with ぢ parameter', function () {
			japanese.romanize('アルヂャヂーラのひぢょうようヂェットのそうぢゅう', {
				'ぢ': 'di'
			}).should.be.exactly('arudyadīranohidyōyōdyettonosōdyū');
			japanese.romanize('デュラララのエンディング', {'ぢ': 'di'}).should.be.exactly('deurararanoendeingu');

			japanese.romanize('アルヂャヂーラのひぢょうようヂェットのそうぢゅう', {
				'ぢ': 'zi'
			}).should.be.exactly('aruzyazīranohizyōyōzyettonosōzyū');
			japanese.romanize('デュラララのエンディング', {'ぢ': 'zi'}).should.be.exactly('dyurararanoendingu');

			japanese.romanize('アルヂャヂーラのひぢょうようヂェットのそうぢゅう', {
				'ぢ': 'ji'
			}).should.be.exactly('arujajīranohijōyōjettonosōjū');
			japanese.romanize('デュラララのエンディング', {'ぢ': 'ji'}).should.be.exactly('dyurararanoendingu');

			japanese.romanize('アルヂャヂーラのひぢょうようヂェットのそうぢゅう', {
				'ぢ': 'dji'
			}).should.be.exactly('arudjadjīranohidjōyōdjettonosōdjū');
			japanese.romanize('デュラララのエンディング', {'ぢ': 'dji'}).should.be.exactly('dyurararanoendingu');

			japanese.romanize('アルヂャヂーラのひぢょうようヂェットのそうぢゅう', {
				'ぢ': 'dzi'
			}).should.be.exactly('arudzyadzīranohidzyōyōdzyettonosōdzyū');
			japanese.romanize('デュラララのエンディング', {'ぢ': 'dzi'}).should.be.exactly('dyurararanoendingu');
		});

		it('must be properly customizable with づ parameter', function () {
			japanese.romanize('いなづま', {'づ': 'du'}).should.be.exactly('inaduma');
			japanese.romanize('デラ・モチマッヅィ', {'づ': 'du'}).should.be.exactly('dera-mochimaddui');
			japanese.romanize('しきえいきヤマザナドゥ', {'づ': 'du'}).should.be.exactly('shikieikiyamazanadou');

			japanese.romanize('いなづま', {'づ': 'zu'}).should.be.exactly('inazuma');
			japanese.romanize('デラ・モチマッヅィ', {'づ': 'zu'}).should.be.exactly('dera-mochimazzui');
			japanese.romanize('しきえいきヤマザナドゥ', {'づ': 'zu'}).should.be.exactly('shikieikiyamazanadu');

			japanese.romanize('いなづま', {'づ': 'dsu'}).should.be.exactly('inadsuma');
			japanese.romanize('デラ・モチマッヅィ', {'づ': 'dsu'}).should.be.exactly('dera-mochimaddsui');
			japanese.romanize('しきえいきヤマザナドゥ', {'づ': 'dsu'}).should.be.exactly('shikieikiyamazanadu');

			japanese.romanize('いなづま', {'づ': 'dzu'}).should.be.exactly('inadzuma');
			japanese.romanize('デラ・モチマッヅィ', {'づ': 'dzu'}).should.be.exactly('dera-mochimaddzui');
			japanese.romanize('しきえいきヤマザナドゥ', {'づ': 'dzu'}).should.be.exactly('shikieikiyamazanadu');
		});

		it('must be properly customizable with ああ parameter', function () {
			japanese.romanize('まあ、そうなるな', {'ああ': 'aa'}).should.be.exactly('maa,sōnaruna');
			japanese.romanize('おかあさんといっしょ', {'ああ': 'aa'}).should.be.exactly('okaasantoissho');

			japanese.romanize('まあ、そうなるな', {'ああ': 'ah'}).should.be.exactly('mah,sōnaruna');
			japanese.romanize('おかあさんといっしょ', {'ああ': 'ah'}).should.be.exactly('okahsantoissho');

			japanese.romanize('まあ、そうなるな', {'ああ': 'â'}).should.be.exactly('mâ,sōnaruna');
			japanese.romanize('おかあさんといっしょ', {'ああ': 'â'}).should.be.exactly('okâsantoissho');

			japanese.romanize('まあ、そうなるな', {'ああ': 'ā'}).should.be.exactly('mā,sōnaruna');
			japanese.romanize('おかあさんといっしょ', {'ああ': 'ā'}).should.be.exactly('okāsantoissho');

			japanese.romanize('まあ、そうなるな', {'ああ': 'a'}).should.be.exactly('ma,sōnaruna');
			japanese.romanize('おかあさんといっしょ', {'ああ': 'a'}).should.be.exactly('okasantoissho');
		});

		it('must be properly customizable with いい parameter', function () {
			japanese.romanize('くもいいちりん', {'いい': 'ii'}).should.be.exactly('kumoiichirin');
			japanese.romanize('ほしいみき', {'いい': 'ii'}).should.be.exactly('hoshiimiki');

			japanese.romanize('くもいいちりん', {'いい': 'ih'}).should.be.exactly('kumoihchirin');
			japanese.romanize('ほしいみき', {'いい': 'ih'}).should.be.exactly('hoshihmiki');

			japanese.romanize('くもいいちりん', {'いい': 'î'}).should.be.exactly('kumoîchirin');
			japanese.romanize('ほしいみき', {'いい': 'î'}).should.be.exactly('hoshîmiki');

			japanese.romanize('くもいいちりん', {'いい': 'ī'}).should.be.exactly('kumoīchirin');
			japanese.romanize('ほしいみき', {'いい': 'ī'}).should.be.exactly('hoshīmiki');

			japanese.romanize('くもいいちりん', {'いい': 'i'}).should.be.exactly('kumoichirin');
			japanese.romanize('ほしいみき', {'いい': 'i'}).should.be.exactly('hoshimiki');
		});

		it('must be properly customizable with うう parameter', function () {
			japanese.romanize('すずみやハルヒのゆううつ', {'うう': 'uu'}).should.be.exactly('suzumiyaharuhinoyuuutsu');
			japanese.romanize('やじゅうせんぱい', {'うう': 'uu'}).should.be.exactly('yajuusenpai');

			japanese.romanize('すずみやハルヒのゆううつ', {'うう': 'uh'}).should.be.exactly('suzumiyaharuhinoyuhutsu');
			japanese.romanize('やじゅうせんぱい', {'うう': 'uh'}).should.be.exactly('yajuhsenpai');

			japanese.romanize('すずみやハルヒのゆううつ', {'うう': 'û'}).should.be.exactly('suzumiyaharuhinoyûutsu');
			japanese.romanize('やじゅうせんぱい', {'うう': 'û'}).should.be.exactly('yajûsenpai');

			japanese.romanize('すずみやハルヒのゆううつ', {'うう': 'ū'}).should.be.exactly('suzumiyaharuhinoyūutsu');
			japanese.romanize('やじゅうせんぱい', {'うう': 'ū'}).should.be.exactly('yajūsenpai');

			// TODO: should be 'suzumiyaharuhinoyuutsu'
			japanese.romanize('すずみやハルヒのゆううつ', {'うう': 'u'}).should.be.exactly('suzumiyaharuhinoyutsu');
			japanese.romanize('やじゅうせんぱい', {'うう': 'u'}).should.be.exactly('yajusenpai');
		});

		it('must be properly customizable with ええ parameter', function () {
			japanese.romanize('はるうええりい', {'ええ': 'ee'}).should.be.exactly('harūeerii');
			japanese.romanize('ナナシノゲエム', {'ええ': 'ee'}).should.be.exactly('nanashinogeemu');

			japanese.romanize('はるうええりい', {'ええ': 'eh'}).should.be.exactly('harūehrii');
			japanese.romanize('ナナシノゲエム', {'ええ': 'eh'}).should.be.exactly('nanashinogehmu');

			japanese.romanize('はるうええりい', {'ええ': 'ê'}).should.be.exactly('harūêrii');
			japanese.romanize('ナナシノゲエム', {'ええ': 'ê'}).should.be.exactly('nanashinogêmu');

			japanese.romanize('はるうええりい', {'ええ': 'ē'}).should.be.exactly('harūērii');
			japanese.romanize('ナナシノゲエム', {'ええ': 'ē'}).should.be.exactly('nanashinogēmu');

			japanese.romanize('はるうええりい', {'ええ': 'e'}).should.be.exactly('harūerii');
			japanese.romanize('ナナシノゲエム', {'ええ': 'e'}).should.be.exactly('nanashinogemu');
		});

		it('must be properly customizable with おお parameter', function () {
			japanese.romanize('おおつぼゆか', {'おお': 'oo'}).should.be.exactly('ootsuboyuka');
			japanese.romanize('ソードアートオンライン', {'おお': 'oo'}).should.be.exactly('sōdoātoonrain');

			japanese.romanize('おおつぼゆか', {'おお': 'oh'}).should.be.exactly('ohtsuboyuka');
			japanese.romanize('ソードアートオンライン', {'おお': 'oh'}).should.be.exactly('sōdoātohnrain');

			japanese.romanize('おおつぼゆか', {'おお': 'ô'}).should.be.exactly('ôtsuboyuka');
			japanese.romanize('ソードアートオンライン', {'おお': 'ô'}).should.be.exactly('sōdoātônrain');

			japanese.romanize('おおつぼゆか', {'おお': 'ō'}).should.be.exactly('ōtsuboyuka');
			japanese.romanize('ソードアートオンライン', {'おお': 'ō'}).should.be.exactly('sōdoātōnrain');

			japanese.romanize('おおつぼゆか', {'おお': 'o'}).should.be.exactly('otsuboyuka');
			japanese.romanize('ソードアートオンライン', {'おお': 'o'}).should.be.exactly('sōdoātonrain');
		});

		it('must be properly customizable with あー parameter', function () {
			japanese.romanize('トレーディングカードゲーム', {'あー': 'a-'}).should.be.exactly('tore-dinguka-doge-mu');
			japanese.romanize('トレーディングカードゲーム', {'あー': 'aa'}).should.be.exactly('toreedingukaadogeemu');
			japanese.romanize('トレーディングカードゲーム', {'あー': 'ah'}).should.be.exactly('torehdingukahdogehmu');
			japanese.romanize('トレーディングカードゲーム', {'あー': 'â'}).should.be.exactly('torêdingukâdogêmu');
			japanese.romanize('トレーディングカードゲーム', {'あー': 'ā'}).should.be.exactly('torēdingukādogēmu');
			japanese.romanize('トレーディングカードゲーム', {'あー': 'a'}).should.be.exactly('toredingukadogemu');
		});

		it('must be properly customizable with あー parameter', function () {
			japanese.romanize('えいせいへい', {'えい': 'ei'}).should.be.exactly('eiseihei');
			japanese.romanize('えいせいへい', {'えい': 'ee'}).should.be.exactly('eeseehee');
			japanese.romanize('えいせいへい', {'えい': 'eh'}).should.be.exactly('ehsehheh');
			japanese.romanize('えいせいへい', {'えい': 'ê'}).should.be.exactly('êsêhê');
			japanese.romanize('えいせいへい', {'えい': 'ē'}).should.be.exactly('ēsēhē');
			japanese.romanize('えいせいへい', {'えい': 'e'}).should.be.exactly('esehe');
		});

		it('must be properly customizable with おう parameter', function () {
			japanese.romanize('とうほうえいやしょう', {'おう': 'ou'}).should.be.exactly('touhoueiyashou');
			japanese.romanize('とうほうえいやしょう', {'おう': 'oo'}).should.be.exactly('toohooeiyashoo');
			japanese.romanize('とうほうえいやしょう', {'おう': 'oh'}).should.be.exactly('tohhoheiyashoh');
			japanese.romanize('とうほうえいやしょう', {'おう': 'ô'}).should.be.exactly('tôhôeiyashô');
			japanese.romanize('とうほうえいやしょう', {'おう': 'ō'}).should.be.exactly('tōhōeiyashō');
			japanese.romanize('とうほうえいやしょう', {'おう': 'o'}).should.be.exactly('tohoeiyasho');
		});

		it('must be properly customizable with んあ parameter', function () {
			japanese.romanize('きんいろモザイク', {'んあ': 'na'}).should.be.exactly('kiniromozaiku');
			japanese.romanize('うちゅうせんかんヤマト', {'んあ': 'na'}).should.be.exactly('uchūsenkanyamato');
			japanese.romanize('きんいろモザイク', {'んあ': 'n\'a'}).should.be.exactly('kin\'iromozaiku');
			japanese.romanize('うちゅうせんかんヤマト', {'んあ': 'n\'a'}).should.be.exactly('uchūsenkan\'yamato');
			japanese.romanize('きんいろモザイク', {'んあ': 'n-a'}).should.be.exactly('kin-iromozaiku');
			japanese.romanize('うちゅうせんかんヤマト', {'んあ': 'n-a'}).should.be.exactly('uchūsenkan-yamato');
		});

		it('must be properly customizable with んば parameter', function () {
			japanese.romanize('のんのんびよりなんみん', {'んば': 'nba'}).should.be.exactly('nonnonbiyorinanmin');
			japanese.romanize('こころぴょんぴょん', {'んば': 'nba'}).should.be.exactly('kokoropyonpyon');

			japanese.romanize('のんのんびよりなんみん', {'んば': 'mba'}).should.be.exactly('nonnombiyorinammin');
			japanese.romanize('こころぴょんぴょん', {'んば': 'mba'}).should.be.exactly('kokoropyompyon');
		});

		it('must be properly customizable with っち parameter', function () {
			japanese.romanize('ひだまりスケッチ', {'っち': 'tti'}).should.be.exactly('hidamarisuketti');
			japanese.romanize('まっちょしぃ', {'っち': 'tti'}).should.be.exactly('mattyoshii');

			japanese.romanize('ひだまりスケッチ', {'っち': 'tchi'}).should.be.exactly('hidamarisuketchi');
			japanese.romanize('まっちょしぃ', {'っち': 'tchi'}).should.be.exactly('matchoshii');

			japanese.romanize('ひだまりスケッチ', {'っち': 'cchi'}).should.be.exactly('hidamarisukecchi');
			japanese.romanize('まっちょしぃ', {'っち': 'cchi'}).should.be.exactly('macchoshii');
		});

		it('must be properly customizable with ゐ parameter', function () {
			japanese.romanize('いなばてゐ', {'ゐ': 'i'}).should.be.exactly('inabatei');
			japanese.romanize('ヱヴァンゲリヲン', {'ゐ': 'i'}).should.be.exactly('evangerion');

			japanese.romanize('いなばてゐ', {'ゐ': 'wi'}).should.be.exactly('inabatewi');
			japanese.romanize('ヱヴァンゲリヲン', {'ゐ': 'wi'}).should.be.exactly('wevangerion');
		});

		it('must be properly customizable with を parameter', function () {
			japanese.romanize('パパのいうことをききなさい!', {'を': 'o'}).should.be.exactly('papanoiukotookikinasai');
			japanese.romanize('をきゅうくうぼ', {'を': 'o'}).should.be.exactly('okyūkūbo');

			japanese.romanize('パパのいうことをききなさい!', {'を': 'wo'}).should.be.exactly('papanoiukotowokikinasai');
			japanese.romanize('をきゅうくうぼ', {'を': 'wo'}).should.be.exactly('wokyūkūbo');
		});
	});
});
