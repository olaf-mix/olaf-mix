function generateMixSet() {
    const ALL_LETTER = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY';
    const ALL_CHAR = ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_#!~.*-+';
    const splitedLetter = ALL_LETTER.split('');
    const splitedChar = ALL_CHAR.split('');

    const mixBook = new Map();
    let letterPieceCount = 1;
    let cacheLetter = [...splitedLetter];
    for (let j = 0; j < 10; j++){
        const mixPieceList = [];
        const charPieceLength = j+1;
        let cacheChar = [...splitedChar];
        if (!charPieceLength){
            continue;
        }
        while(cacheChar.length > 0){
            let key = '';
            let piece = '';
            if (cacheLetter.length < letterPieceCount){
                letterPieceCount++;
                cacheLetter = Array(letterPieceCount).fill([...splitedLetter]).flat();
            }
            key += cacheLetter.splice(Math.floor(Math.random() * cacheLetter.length), letterPieceCount).join('');
            for (let i = 0; i < charPieceLength && cacheChar.length > 0; i++) {
                piece += cacheChar.splice(Math.floor(Math.random() * cacheChar.length), 1).join('');
            }
            mixPieceList.push({
                name: `__olaf__var__${key}__`,
                value: piece
            })
        }
        mixBook.set(charPieceLength, mixPieceList);
    }
    return mixBook;
}

function getStringPositionFromMixSet(mixSet, string) {
    const mixList = flatMixSet(mixSet);
    const hasStringList = mixList.filter(({value}) => value.indexOf(string) !== -1);
    if (hasStringList.length <= 0){
        return {
            key: null,
            position: -1,
            length: 0,
            oriString: string
        };
    }
    const {name, value} = hasStringList[Math.floor(Math.random()*hasStringList.length)];
    return {
        key: name,
        position: value.indexOf(string),
        length: 1,
        oriString: string
    }
}

function flatMixSet(mixSet){
    return Array.from(mixSet.values()).flat();
}


module.exports = {
    generateMixSet,
    flatMixSet,
    getStringPositionFromMixSet
};

