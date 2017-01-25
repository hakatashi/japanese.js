# japanese.js [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][gemnasium-image]][gemnasium-url] [![Greenkeeper badge](https://badges.greenkeeper.io/hakatashi/japanese.js.svg)](https://greenkeeper.io/)

> Util collection for Japanese text processing. Hiraganize, Katakanize, and Romanize.


## Install

```sh
$ npm install --save japanese
```

## Usage

```js
var japanese = require('japanese');

japanese.hiraganize('ヱヴァンゲリヲン');
```

For crazy syntax sugar junkies:

```js
var japanese = require('japanese/sugar');

'ヱヴァンゲリヲン'.hiraganize();
```

## Command

Command Line Interface is also available.

```
$ npm install japanese -g
$ japanese

  Util collection for Japanese text processing. Hiraganize, Katakanize, and Romanize.

  Usage:
    japanese <input> [options]

  Options:
    -h, --hiraganize   hiraganize input string
    -k, --katakanize   katakanize input string
    -r, --romanize     romanize input string

  Example
    japanese ヱヴァンゲリヲン --hiraganize
```

## API

### japanese.hiraganize(text)

Convert input katakana into hiragana.

#### Arguments

* `text` The text to hiraganize

#### Example

```js
japanese.hiraganize('ヱヴァンゲリヲン');     // ゑゔぁんげりをん
japanese.hiraganize('チヨコバナヽ');         // ちよこばなゝ
japanese.hiraganize('ヹルタースオリジナル'); // ゑ゙るたーすおりじなる
japanese.hiraganize('板垣死ス𪜈');           // 板垣死すとも
```

### japanese.katakanize(text)

Convert input hiragana into katakana.

#### Arguments

* `text` The text to katakanize

#### Example

```js
japanese.katakanize('抹茶あいす');       // 抹茶アイス
japanese.katakanize('ばゞへらあいす');   // バヾヘラアイス
japanese.katakanize('ゐ゙よろん');         // ヸヨロン
japanese.katakanize('本日ゟかき氷解禁'); // 本日ヨリカキ氷解禁
```

### japanese.romanize(text[, config])

Convert input text into romaji.

**important**: Most definitions of Japanese text romanizations require total recognition of
Japanese text, but [robots cannot actually think or understand](http://www.cleverbot.com/)!
Some conversions are hopelessly poor. For example, ISO 3602 defines that "こうし" which
means "講師" must be romanized as "kôsi", while "こうし" which means "子牛" must be romanized
as "kousi" (because 子牛 is mixed word of 子 and 牛), though these are apparently the same
in Kana-form. While japanese.js is very... very very thoroughly tested, this module (and any
other romanization machines) cannot distinguish between these semantics. So unfortunately,
you cannot use this function for official writing or something. Ugh.

#### Arguments

* `text` The text to romanize
* `config` The configuration object or string used to romanize. Described below.

#### Example

```js
japanese.romanize('れんあいかんじょう');       // ren'aikanjō
japanese.romanize('ツァトゥグァ');             // tsatugwa
japanese.romanize('くうぼをきゅう', 'kunrei'); // kûbookyû
japanese.romanize('でんぢゃらす', 'nihon');    // dendyarasu
japanese.romanize('いいづか とおる', {
	'いい': 'ii',
	'おお': 'oh',
});                                            // iizuka tohru
```

#### Configs

Config is represented as plain object, where object keys stand for a collection of
similar characters, and the value determines how these characters are converted.
So the object is not just the same as a conversion table.

Available parameters are following.

| Key  | Available Values    |
|------|---------------------|
| し   | si, shi             |
| ち   | ti, chi             |
| つ   | tu, tsu             |
| ふ   | hu, fu              |
| じ   | zi, ji              |
| ぢ   | di, zi, ji, dzi, dji|
| づ   | du, zu, dsu, dzu    |
| ああ | aa, ah, â, ā, a     |
| いい | ii, ih, î, ī, i     |
| うう | uu, uh, û, ū, u     |
| ええ | ee, eh, ê, ē, e     |
| おお | oo, oh, ô, ō, o     |
| あー | a-, aa, ah, â, ā, a |
| えい | ei, ee, eh, ê, ē, e |
| おう | ou, oo, oh, ô, ō, o |
| んあ | na, n'a, n-a        |
| んば | nba, mba            |
| っち | tti, tchi, cchi     |
| ゐ   | i, wi               |
| を   | o, wo               |

You can also specify these predefined configs by supplying a string. Default is **wikipedia**.

|      | 'wikipedia' | 'traditional hepburn' | 'modified hepburn' | 'kunrei' | 'nihon' |
|------|-------------|-----------------------|--------------------|----------|---------|
| し   | shi         | shi                   | shi                | si       | si      |
| ち   | chi         | chi                   | chi                | ti       | ti      |
| つ   | tsu         | tsu                   | tsu                | tu       | tu      |
| ふ   | fu          | fu                    | fu                 | hu       | hu      |
| じ   | ji          | ji                    | ji                 | zi       | zi      |
| ぢ   | ji          | ji                    | ji                 | zi       | di      |
| づ   | zu          | zu                    | zu                 | zu       | du      |
| ああ | aa          | aa                    | ā                  | â        | ā       |
| いい | ii          | ii                    | ii                 | î        | ī       |
| うう | ū           | ū                     | ū                  | û        | ū       |
| ええ | ee          | ee                    | ē                  | ê        | ē       |
| おお | ō           | ō                     | ō                  | ô        | ō       |
| あー | ā           | ā                     | ā                  | â        | ā       |
| えい | ei          | ei                    | ei                 | ei       | ei      |
| おう | ō           | ō                     | ō                  | ô        | ō       |
| んあ | n'a         | n-a                   | n'a                | n'a      | n'a     |
| んば | nba         | mba                   | nba                | nba      | nba     |
| っち | tchi        | tchi                  | tchi               | tti      | tti     |
| ゐ   | i           | i                     | i                  | i        | wi      |
| を   | o           | wo                    | o                  | o        | wo      |

And here are short notes about these romanizations.

##### Wikipedia style

Source: http://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Japan-related_articles#Romanization

The most modern and widely used form of romanization. Wikipedia uses this guideline to name
their article title and text. This is mixed version of traditional and modified Hepburn
and easily recognizable for everyone.

##### Traditional and Modified Hepburn

Source: http://en.wikipedia.org/wiki/Hepburn_romanization

Actually this is not a specification. Hepburn romanization is very widely known but nobody
other than Hepburn knows the REAL definition of these method.

##### Kunrei-shiki and Nihon-shiki

Source: http://www.iso.org/iso/catalogue_detail.htm?csnumber=9029

Kunrei-shiki is defined as ISO 9029 and Nihon-shiki as ISO 9209 Strict. These romanizations
are today kind of obsolete but still the only standardized romanization in the world.


## Roadmap

* japanese.deromanize()
* japanese.cyrillize()
* japanese.decyrillize()
* japanese.hangulize()
* japanese.dehangulize()
* japanese.arabize()
* japanese.dearabize()
* japanese.gyarumojize()
* japanese.isKatakana()
* japanese.isHiragana()
* japanese.isKanji()
* japanese.isJoyoKanji()
* japanese.isKinsoku() (JIS X 4051 compatibility is preferred)
* CLI
  - `--input <file>` and `--output <file>` option
  - `japanese --hiraganize <string>` to work

...and any proposal or idea for enhancing japanese.js is welcomed! [Tell me](https://github.com/hakatashi/japanese.js/issues), [tell me](https://twitter.com/intent/tweet?text=Hey+@hakatashi+I+have+a+great+idea+for+enhancing+japanese.js.+That+is...), [tell me](mailto:hakatasiloving@gmail.com)!

## License

MIT © [hakatashi](http://hakatashi.com/)


[npm-url]: https://npmjs.org/package/japanese
[npm-image]: https://badge.fury.io/js/japanese.svg
[travis-url]: https://travis-ci.org/hakatashi/japanese.js
[travis-image]: https://travis-ci.org/hakatashi/japanese.js.svg?branch=master
[coveralls-url]: https://coveralls.io/r/hakatashi/japanese.js
[coveralls-image]: https://coveralls.io/repos/hakatashi/japanese.js/badge.svg
[gemnasium-url]: https://gemnasium.com/hakatashi/japanese.js
[gemnasium-image]: https://gemnasium.com/hakatashi/japanese.js.svg
