const path = require('path');
const fs = require('fs');
const os = require('os');
const numeral = require('numeral');
const j = require('jscodeshift');
const log = require('loglevel');

const TEMP = ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_#.*-+';

const INDEX_ARRAY_FROM_STRING = (string) => {
    return string.split('').map(_ => TEMP.indexOf(_));
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

const CONVER_LITERAL_MATTER = (path) => {
    const value = path.getValueProperty('value');
    if (typeof value === 'string'){
        const index_array = INDEX_ARRAY_FROM_STRING(value);
        const safeMemberExpression = (index, defaultString) => {
            if (index === -1){
                return j.stringLiteral(defaultString)
            }
            const numericLiteral = j.numericLiteral(index)
            numericLiteral.extra.raw = `0x${index.toString(16)}`
            return j.memberExpression(
                j.identifier('TEMP'),
                numericLiteral,
                true
            )
        };
        const createBinary = (index, index_array) => {
            if (index === 0){
                return safeMemberExpression(index_array[index], value[index])
            }
            return j.binaryExpression(
                '+',
                createBinary(index - 1, index_array),
                safeMemberExpression(index_array[index], value[index])
            );
        };
        if (index_array.length > 0){
            return createBinary(index_array.length - 1, index_array)
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

j.registerMethods({
    findClassDeclaratorsIdentifier: function(className) {
        return this.find(j.ClassDeclaration).find(j.Identifier, _ => {
            return _.name === className
        });
    },
    renameClassName: function(oldName, newName) {
        return this.findClassDeclaratorsIdentifier(oldName).forEach(_ => {
            _.get('name').replace(newName)
        });
    },
    replaceWithKey: function (key, newValueMatter) {
        return this.forEach(_ => {
            if (typeof newValueMatter === 'function'){
                _.get(key).replace(newValueMatter(_.get(key), _));
            } else {
                _.get(key).replace(newValueMatter);
            }
        })
    },
    refactorIdentifierToStringExpression: function (needBracketsWrapper = true) {
        return this.replaceWith(p => CONVER_IDENTIFIER_TO_STRING_EXPRESSION(p, needBracketsWrapper))
    },
    findImmediateChildren: function(type){
        if (!this.isOfType(j.Node)) return [];
        return this.map(parentPath => {
            return j(parentPath)
                .find(type)
                .filter(p => {
                    return p.parentPath.node === parentPath.node;
                })
                .paths();
        });
    },
    renameMemberExpressionVariable: function () {
        if (!this.isOfType(j.MemberExpression)) return [];
        return this.forEach(_ => {
            const object = _.get('object');
            const property = _.get('property');
            if (property.getValueProperty('type') === 'Identifier'){
                j(property).refactorIdentifierToStringExpression(false);
                j(_).replaceWithKey('computed', true)
            }
            if (object.getValueProperty('type') === 'Identifier'){
            }
        })
    }
});


j.registerMethods({
    refactorLiteralValue: function () {
        return this.replaceWith(p => CONVER_LITERAL_MATTER(p))
    }
}, j.Literal);

j.registerMethods({
    olafIdentifierExpression: function(key = 'name'){
        const value = this.paths()[0].getValueProperty(key);
        const createBinary = (index, value) => {
            if (index === 0){
                return j.stringLiteral(value[index])
            }
            return j.binaryExpression(
                '+',
                createBinary(index - 1, value),
                j.stringLiteral(value[index])
            );
        };
        if (value.length > 0){
            return createBinary(value.length - 1, value)
        }
        return null;
    },
}, j.Identifier);



function visitOlafMix(root, callback){
    root.find(j.Comment).forEach(_ => {
        const commentValue = _.getValueProperty('value');
        if (!~commentValue.indexOf('@olaf-mix')){
            return;
        } else {
            j(_).replaceWithKey('value', _ => _.value.replace('@olaf-mix', '@olaf-finish'))
        }
        callback(_.parentPath.parentPath);
    })
}

let isInjectedHelperCode = false;
const transformHandler = function(root) {
    log.debug('********************')
    root.findImmediateChildren(j.Program).forEach(_ => {
        _.getValueProperty('body').unshift(
            j.variableDeclaration('const',
                [j.variableDeclarator(
                    j.identifier('TEMP'),
                    j.literal('asdawdawdawdawd')
                )]
            )
        )
    });
    visitOlafMix(root,npath => {
        if (!isInjectedHelperCode){
            isInjectedHelperCode = true;
        }
        const ncollection = j(npath)
        const ntype = npath.getValueProperty('type');
        if (ntype === 'MethodDefinition'){
            log.debug('******** 方法定义 ********')
            ncollection
                .findImmediateChildren(j.Identifier)
                .refactorIdentifierToStringExpression()
            log.debug('******** 函数定义 ********')
            // ncollection
            //     .find(j.FunctionDeclaration)
            //     .findImmediateChildren(j.Identifier)
            log.debug('********  表达式子树  ********')
            ncollection
                .find(j.BlockStatement)
                .find(j.ExpressionStatement)
                .find(j.Identifier)
                .forEach(_ => {
                    // log.debug(_.getValueProperty('name'));
                });
            log.debug('******** 变量定义子树 ********')
            ncollection
                .find(j.BlockStatement)
                .find(j.VariableDeclaration)
                .find(j.Identifier)
                .forEach(_ => {
                    // log.debug(_.getValueProperty('name'));
                })
            log.debug('******** 方法调用 ********')
            ncollection
                .find(j.CallExpression)
                .findImmediateChildren(j.MemberExpression)
                .renameMemberExpressionVariable()
            log.debug('******** 常量定义 ********')
            ncollection
                .find(j.Literal)
                .refactorLiteralValue()
        } else if (ntype === 'ClassDeclaration'){
            log.debug('定义类');
        } else {
            log.debug('异常定义');
        }
    });
    log.debug('--------------------')
    return true;
};

module.exports = {
    transformHandler,
}
