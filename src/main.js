const path = require('path');
const fs = require('fs');
const TEMP = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_#.*-+';
const os = require('os');
const numeral = require('numeral');
const j = require('jscodeshift');
const log = require('loglevel');

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
            if (typeof newValueMatter === 'string'){
                _.get(key).replace(newValueMatter);
            } else if (typeof newValueMatter === 'function'){
                _.get(key).replace(newValueMatter(_.get(key), _));
            }
        })
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
    renameMemberExpressionVariable: function (converMatter = CONVER_NAME_MATTER) {
        if (!this.isOfType(j.MemberExpression)) return [];
        return this.forEach(_ => {
            const object = _.get('object');
            const property = _.get('property');
            if (property.getValueProperty('type') === 'Identifier'){
                const name = property.getValueProperty('name');
                property.get('name').replace(converMatter(name));
                _.get('computed').replace(true)
            }
            if (object.getValueProperty('type') === 'Identifier'){
            }
        })
    }
});


j.registerMethods({
    refactorLiteralValue: function (converMatter = CONVER_NAME_MATTER) {
        return this.replaceWith(p => CONVER_LITERAL_MATTER(p))
    }
}, j.Literal);

const INDEX_ARRAY_FROM_STRING = (string) => {
    return string.split('').map(_ => TEMP.indexOf(_));
};

const CONVER_TO_ARRAY = (string) => {
    return INDEX_ARRAY_FROM_STRING(string).map(_ => `TEMP[${_}]`).join('+')
};

const CONVER_NAME_MATTER = (oldName) => {
    return `[${CONVER_TO_ARRAY(oldName)}]`;
};

const CONVER_LITERAL_MATTER = (path) => {
    const value = path.getValueProperty('value');
    if (typeof value === 'string'){
        const index_array = INDEX_ARRAY_FROM_STRING(value);
        const createBinary = (index, index_array) => {
            if (index === 0){
                return j.memberExpression(
                    j.identifier('TEMP'),
                    j.numericLiteral(index_array[index]),
                    true
                )
            }
            return j.binaryExpression(
                '+',
                createBinary(index - 1, index_array),
                j.memberExpression(
                    j.identifier('TEMP'),
                    j.numericLiteral(index_array[index]),
                    true
                )
            );
        }
        if (index_array.length > 0){
            return createBinary(index_array.length - 1, index_array)
        }
    }
    if (typeof value === 'number'){
        if (Math.random() < 1){
            const left = Math.ceil(Math.random()*(value*0.5));
            // const left = numeral(1);
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
}

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


const transformHandler = function(root) {
    log.debug('********************')
    visitOlafMix(root,npath => {
        const ncollection = j(npath)
        const ntype = npath.getValueProperty('type');
        if (ntype === 'MethodDefinition'){
            log.debug('******** 方法定义 ********')
            ncollection
                .replaceWithKey('key', _ => {
                    return CONVER_NAME_MATTER(_.getValueProperty('name'));
                })
            log.debug('******** 函数定义 ********')
            ncollection
                .find(j.FunctionDeclaration)
                .replaceWithKey('id',  _ => {
                    return CONVER_NAME_MATTER(_.getValueProperty('name'));
                });
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
            log.debug('******** 常量定义 ********')
            ncollection
                .find(j.Literal)
                .refactorLiteralValue()
            log.debug('******** 方法调用 ********')
            ncollection
                .find(j.CallExpression)
                .findImmediateChildren(j.MemberExpression)
                .renameMemberExpressionVariable()
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
