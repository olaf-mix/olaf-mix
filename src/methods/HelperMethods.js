const {MIX_BOOK} = require('../util/GlobalConstant');

function getStringPositionFromMixBook(string) {
    for (let key in MIX_BOOK){
        if (MIX_BOOK.hasOwnProperty(key)){
            const index = MIX_BOOK[key].indexOf(string);
            if (index !== -1){
                return {
                    key: key,
                    position: index,
                }
            }
        }
    }
    return null
}

module.exports = {
    getStringPositionFromMixBook
};
