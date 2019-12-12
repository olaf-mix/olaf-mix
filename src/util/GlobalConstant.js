const ALL_LETTER = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY';
const ALL_CHAR = ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_#!~.*-+';
const PIECE_COUNT = 5;

let cacheLetter = ALL_LETTER.split('');
let cacheChar = ALL_CHAR.split('');
const letterLength = Math.ceil(ALL_LETTER.length/5)
const charLength = Math.ceil(ALL_CHAR.length/5)

const MIX_BOOK = {};
for (let i = 0; i < PIECE_COUNT; i++){
    let key = '';
    let piece = '';
    for (let j = 0; j < letterLength && cacheLetter.length > 0; j++){
        key += cacheLetter.splice(Math.floor(Math.random()*cacheLetter.length), 1)[0];
    }
    for (let j = 0; j < charLength && cacheChar.length > 0; j++){
        piece += cacheChar.splice(Math.floor(Math.random()*cacheChar.length), 1)[0];
    }
    MIX_BOOK[`__${key}__`] = piece;
}


const MIX_LIST = [];
for (let key in MIX_BOOK){
    if (MIX_BOOK.hasOwnProperty(key)){
        MIX_LIST.push({k: key, v: MIX_BOOK[key]})
    }
}

module.exports = {
    MIX_BOOK,
    MIX_LIST
}
