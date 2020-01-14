const numeral = require('numeral');
const log = require('loglevel');
const j = require('jscodeshift');
const {flatMixSet, generateMixSet} = require('./methods/HelperMethods');
require('./methods/registerMethods');

const DEFAULT_MIX_LIST = generateMixSet();

function doInject(root, options) {
    const {mode, mixSet} = options;
    const generateHelperVarNode = (mixSet) => {
        return j.variableDeclaration('var',
            flatMixSet(mixSet).map(({name, value}) => {
                return j.variableDeclarator(
                    j.identifier(name),
                    j.literal(value)
                );
            })
        )
    };
    if(mode === 'module'){
        root.findImmediateChildren(j.Program).forEach(_ => {
            _.getValueProperty('body').unshift(
                generateHelperVarNode(mixSet)
            )
        });
    } else if (mode === 'umd'){
        root.findImmediateChildren(j.Program)
            .findImmediateChildren(j.ExpressionStatement)
            .findImmediateChildren(j.CallExpression)
            .getArgumentNodes()
            .findImmediateChildren(j.FunctionExpression)
            .forEach(node => {
                try{
                    const body = node.get('body').value.body;
                    const varNode = generateHelperVarNode(mixSet);
                    if (body.length > 1){
                        body.splice(Math.floor(1+Math.random()*(body.length-2)), 0, varNode);
                    }
                } catch (e) {
                    console.error(`生成辅助方法失败: ${e}`);
                }
            })
    }
    return {
        root,
        options
    }
}

let hadInjectedHelperCode = false;
const doTransform = function(root, options) {
    log.debug('********************')
    const {moduleInjectedHelpCode, refreshHelpCode, mixSet} = options;
    if (moduleInjectedHelpCode){
        if (refreshHelpCode || !hadInjectedHelperCode){
            doInject(root, {
                mixSet,
                mode: 'module'
            });
            hadInjectedHelperCode = true;
        }
    }
    _visitOlafMix('@olaf-mix', root,npath => {
        const ncollection = j(npath)
        const ntype = npath.getValueProperty('type');
        if (ntype === 'MethodDefinition' ||
            ntype === 'ClassMethod' ||
            ntype === 'FunctionDeclaration'){
            log.debug('******** 方法定义 ********')
            let filter = null;
            if (ntype === 'ClassMethod'){
                filter = _ => _.parentPath.name !== 'params'
            }
            if (ntype !== 'FunctionDeclaration'){
                ncollection
                    .findImmediateChildren(j.Identifier, filter)
                    .refactorIdentifierToStringExpression()
            }
            log.debug('******** 函数定义 ********')
            ncollection
                .find(j.FunctionDeclaration)
                .findImmediateChildren(j.Identifier)
            log.debug('******** 表达式子树 ********')
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
                .refactorLiteralValue(mixSet)
        } else if (ntype === 'ClassDeclaration'){
            log.debug('定义类');
        } else if (ntype === 'VariableDeclaration') {
            ncollection
                .find(j.Literal)
                .refactorLiteralValue(mixSet)
            log.debug('异常定义');
        }
    });
    _visitOlafMix('@olaf-string', root,npath => {
        const ncollection = j(npath)
        const ntype = npath.getValueProperty('type');
        if (ntype === 'VariableDeclaration') {
            ncollection
                .find(j.Literal)
                .refactorLiteralValue(mixSet, 1)
        } else {
            log.debug('异常定义');
        }
    })
    log.debug('--------------------')
    return {
        mixSet
    };
};

function _visitOlafMix(comment, root, callback){
    root.find(j.Comment).forEach(_ => {
        const commentValue = _.getValueProperty('value');
        if (!~commentValue.indexOf(comment)){
            return;
        } else {
            _.replace(j.commentBlock(commentValue.replace(comment, '@olaf-finish')));
        }
        callback(_.parentPath.parentPath);
    })
}

const JSCODESHIFT_DEFAULT_OPTION = {
    quote: 'single'
};

const DEFAULT_OPTION =  {
    moduleInjectedHelpCode: true,
    refreshHelpCode: false,
    jscodeshift: JSCODESHIFT_DEFAULT_OPTION,
    parser: 'js'
};

const injectHelperCode = function (code, options = {}) {
    const opt = safeOptions(options);
    const {parser, mode='module', mixSet=DEFAULT_MIX_LIST} = opt;
    let root = createJNode(code, parser);
    doInject(root, {
        mode,
        mixSet
    });
    return {
        mixSet,
        root,
        source: root.toSource({...opt.jscodeshift})
    }
}

const mixCode = function(code, options){
    const opt = safeOptions(options);
    const {parser, moduleInjectedHelpCode, refreshHelpCode, mixSet=DEFAULT_MIX_LIST} = opt;
    let root = createJNode(code, parser);
    doTransform(root, {moduleInjectedHelpCode, refreshHelpCode, mixSet});
    return {
        mixSet,
        root,
        source: root.toSource({...opt.jscodeshift})
    }
};


const createJNode = function(code, parser){
    let root;
    if (parser !== 'js'){
        root = j.withParser(parser)(code);
    } else {
        root = j(code);
    }
    return root
};

const safeOptions = function(options){
    return {
        ...DEFAULT_OPTION,
        ...options
    };
}

module.exports = {
    mixCode,
    injectHelperCode,
    ...require('./methods/HelperMethods')
};


