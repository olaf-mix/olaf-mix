const j = require('jscodeshift');
const numeral = require('numeral');
const {getStringPositionFromMixSet} = require('./HelperMethods');


const MIX_FOR_TEXT = (mixSet, text) => {
    return text.split('').map(_ => getStringPositionFromMixSet(mixSet, _));
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


const CONVER_LITERAL_TO_BUFFER_MATTER = (mixSet, path) => {
    const value = path.getValueProperty('value');
    if (typeof value === 'string'){

    }
    if (typeof value === 'number'){
    }

    if (value instanceof RegExp){
    }
    return path.node;
};


const CONVER_LITERAL_MATTER = (mixSet, path) => {
    const value = path.getValueProperty('value');
    if (typeof value === 'string'){
        const mixed_text = MIX_FOR_TEXT(mixSet, value);
        const safeMemberExpression = ({key, position, oriString}) => {
            if (position === -1){
                return j.stringLiteral(oriString)
            }
            const numericLiteral = j.numericLiteral(position);
            numericLiteral.extra.raw = `0x${position.toString(16).padStart(2, '0')}`;
            return j.memberExpression(
                j.identifier(key),
                numericLiteral,
                true
            )
        };
        const createBinary = (index, mt) => {
            if (index === 0){
                return safeMemberExpression(mt[index])
            }
            return j.binaryExpression(
                '+',
                createBinary(index - 1, mt),
                safeMemberExpression(mt[index])
            );
        };
        if (mixed_text.length > 0){
            return createBinary(mixed_text.length - 1, mixed_text)
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
