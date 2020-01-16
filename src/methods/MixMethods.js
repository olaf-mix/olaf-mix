const j = require('jscodeshift');
const log = require('loglevel');

function mixMethodNode({npath, mixSet}) {
    const ntype = npath.getValueProperty('type');
    const ncollection = j(npath);
    log.debug('******** 混淆方法节点 ********');
    log.debug('方法定义:');
    let filter = null;
    if (ntype === 'ClassMethod'){
        filter = _ => _.parentPath.name !== 'params'
    }
    if (ntype !== 'FunctionDeclaration'){
        ncollection
            .findImmediateChildren(j.Identifier, filter)
            .refactorIdentifierToStringExpression()
    }
    log.debug('函数定义:');
    ncollection
        .find(j.FunctionDeclaration)
        .findImmediateChildren(j.Identifier);
    log.debug('表达式子树:');
    ncollection
        .find(j.BlockStatement)
        .find(j.ExpressionStatement)
        .find(j.Identifier)
        .forEach(_ => {
            // log.debug(_.getValueProperty('name'));
        });
    log.debug('变量定义子树:');
    ncollection
        .find(j.BlockStatement)
        .find(j.VariableDeclaration)
        .find(j.Identifier)
        .forEach(_ => {
            // log.debug(_.getValueProperty('name'));
        });
    log.debug('方法调用:');
    ncollection
        .find(j.CallExpression)
        .findImmediateChildren(j.MemberExpression)
        .renameMemberExpressionVariable();
    log.debug('常量定义:');
    ncollection
        .find(j.Literal)
        .refactorLiteralValue(mixSet)
}

function mixVariableNode({npath, mixSet, type}) {
    const ncollection = j(npath);
    ncollection
        .find(j.Literal)
        .refactorLiteralValue(mixSet, type)
}

module.exports = {
    mixMethodNode,
    mixVariableNode
}
