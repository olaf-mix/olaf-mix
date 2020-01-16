let generteIndex = 0;
function generateMixSet(...counts) {
    const ALL_LETTER = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY';
    const ALL_CHAR = ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_#!~.*-+';
    const splitedLetter = ALL_LETTER.split('');
    const splitedChar = ALL_CHAR.split('');

    const mixBook = new Map();
    let letterPieceCount = 1;
    let cacheLetter = [...splitedLetter];
    if(!counts || counts.length <= 0){
        counts = [5];
    }
    counts.forEach(count => {
        if (!Number.isInteger(count)){
            return
        }
        const mixPieceList = [];
        const charPieceLength = count;
        let cacheChar = [...splitedChar];
        if (!charPieceLength){
            return;
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
                name: `__olaf__var__${generteIndex++}_${key}__`,
                value: piece
            })
        }
        mixBook.set(charPieceLength, mixPieceList);
    })
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
        mixNodeKey: name,
        mixNodeValue: value,
        position: value.indexOf(string),
        length: 1,
        oriString: string
    }
}

function flatMixSet(mixSet){
    return Array.from(mixSet.values()).flat();
}


function randomBarbList(list, isBarb = (_ => _ === 0)) {
    const cache = [...list]
    let round = list.length;
    list.reverse()
        .map((_, index) => {
            if(isBarb(_)){
                round = list.length - index;
            }
            return isBarb(_) ? NaN : round
        })
        .reverse()
        .map((_, index) => {
            if (isNaN(_)){
                return;
            }
            const r = Math.floor(Math.random() * _);
            cache.splice(r, 0, cache[index])
            cache.splice(r < index ? index + 1 : index, 1)
        });
    return cache;
}


module.exports = {
    generateMixSet,
    flatMixSet,
    randomBarbList,
    getStringPositionFromMixSet
};

