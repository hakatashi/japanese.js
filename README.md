# japanese.js [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][gemnasium-image]][gemnasium-url]

> Util collection for Japanese text processing.


## Install

```sh
$ npm install --save japanese
```

## Usage

```js
var japanese = require('japanese');

japanese.hiraganize('ヱヴァンゲリヲン');
```

## API

### japanesee.hiraganize(text)

Covert input katakana into hiragara.

#### Arguments

* `text` The text to hiraganize

#### Example

```js
japanese.hiraganize('ヱヴァンゲリヲン');     // ゑゔぁんげりをん
japanese.hiraganize('チヨコバナヽ');         // ちよこばなゝ
japanese.hiraganize('ヹルタースオリジナル'); // ゑ゙るたーすおりじなる
japanese.hiraganize('板垣死ス𪜈');           // 板垣死すとも
```

### japanesee.katakanize(text)

Covert input hiragana into katakana.

#### Arguments

* `text` The text to katakanize

#### Example

```js
japanese.katakanize('抹茶あいす');       // 抹茶アイス
japanese.katakanize('ばゞへらあいす');   // バヾヘラアイス
japanese.katakanize('ゐ゙よろん');         // ヸヨロン
japanese.katakanize('本日ゟかき氷解禁'); // 本日ヨリカキ氷解禁
```

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
