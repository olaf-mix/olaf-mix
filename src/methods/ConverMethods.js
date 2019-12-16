const j = require('jscodeshift');
const numeral = require('numeral');
const {getStringPositionFromMixBook} = require('./HelperMethods');


const MIX_LIST_FROM_STRING = (string) => {
    return string.split('').map(_ => getStringPositionFromMixBook(_) || {key: _, position: -1});
};

const CONVER_IDENTIFIER_TO_STRING_EXPRESSION = (path, needBracketsWrapper) => {
    const olafExpression = j(path).olafIdentifierExpression();
    if(olafExpression){
        if (needBracketsWrapper){
            return j.arrayExpression([olafExpression])
        } else {
            return olafExpression
        }
    }
    return path.node;
};


const CONVER_LITERAL_TO_BUFFER_MATTER = (path) => {
    const value = path.getValueProperty('value');
    if (typeof value === 'string'){

    }
    if (typeof value === 'number'){
    }

    if (value instanceof RegExp){
    }
    return path.node;
}


const CONVER_LITERAL_MATTER = (path) => {
    const value = path.getValueProperty('value');
    if (typeof value === 'string'){
        const mix_list = MIX_LIST_FROM_STRING(value);
        const safeMemberExpression = ({key, position}) => {
            if (position === -1){
                return j.stringLiteral(key)
            }
            const numericLiteral = j.numericLiteral(position)
            numericLiteral.extra.raw = `0x${position.toString(16).padStart(2, '0')}`
            return j.memberExpression(
                j.identifier(key),
                numericLiteral,
                true
            )
        };
        const createBinary = (index, mix_list) => {
            if (index === 0){
                return safeMemberExpression(mix_list[index])
            }
            return j.binaryExpression(
                '+',
                createBinary(index - 1, mix_list),
                safeMemberExpression(mix_list[index])
            );
        };
        if (mix_list.length > 0){
            return createBinary(mix_list.length - 1, mix_list)
        }
    }
    if (typeof value === 'number'){
        if (Math.random() < 1){
            const left = Math.ceil(Math.random()*(value*0.5));
            return j.binaryExpression(
                '+',
                j.numericLiteral(left),
                j.numericLiteral(numeral(value).subtract(left).value())
            );
        }
    }
    if (typeof value === 'boolean'){
        return j.binaryExpression(
            value?'===':'!==',
            j.numericLiteral(1),
            j.numericLiteral(1)
        );
    }

    if (value instanceof RegExp){
    }
    return path.node;
};

module.exports = {
    CONVER_IDENTIFIER_TO_STRING_EXPRESSION,
    CONVER_LITERAL_TO_BUFFER_MATTER,
    CONVER_LITERAL_MATTER
};
