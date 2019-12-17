const numeral = require('numeral');
const log = require('loglevel');
const j = require('jscodeshift')
const {MIX_LIST} = require('./util/GlobalConstant');
require('./methods/registerMethods');


function injectedHelperCode(root) {
    root.findImmediateChildren(j.Program).forEach(_ => {
        _.getValueProperty('body').unshift(
            j.variableDeclaration('const',
                MIX_LIST.map(({k, v}) => {
                    return j.variableDeclarator(
                        j.identifier(k),
                        j.literal(v)
                    );
                })
            )
        )
    });
}

function visitOlafMix(comment, root, callback){
    root.find(j.Comment).forEach(_ => {
        const commentValue = _.getValueProperty('value');
        if (!~commentValue.indexOf(comment)){
            return;
        } else {
            j(_).replaceWithKey('value', _ => _.value.replace(comment, '@olaf-finish'))
        }
        callback(_.parentPath.parentPath);
    })
}

let isInjectedHelperCode = false;
const transformHandler = function(root, options = {forceInjected: false}) {
    log.debug('********************')
    const {forceInjected} = options;
    if (forceInjected || !isInjectedHelperCode){
        injectedHelperCode(root);
        isInjectedHelperCode = true;
    }
    visitOlafMix('@olaf-mix', root,npath => {
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
        } else if (ntype === 'VariableDeclaration') {
            ncollection
                .find(j.Literal)
                .refactorLiteralValue()
            log.debug('异常定义');
        }
    });
    visitOlafMix('@olaf-string', root,npath => {
        const ncollection = j(npath)
        const ntype = npath.getValueProperty('type');
        if (ntype === 'VariableDeclaration') {
            ncollection
                .find(j.Literal)
                .refactorLiteralValue(1)
        } else {
            log.debug('异常定义');
        }
    })
    log.debug('--------------------')
    return true;
};

module.exports = {
    transformHandler,
};
