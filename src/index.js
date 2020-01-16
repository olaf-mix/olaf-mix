const numeral = require('numeral');
const log = require('loglevel');
const j = require('jscodeshift');
const {mixMethodNode, mixVariableNode} = require('./methods/MixMethods');
const {flatMixSet, generateMixSet, randomBarbList} = require('./methods/HelperMethods');
require('./methods/registerMethods');

const DEFAULT_MIX_SET = generateMixSet();

function doInject(root, options) {
    const {mode, mixSet, isFlatInject} = options;
    const generateHelperVarNode = (mixSet, isFlatInject) => {
        if (isFlatInject){
            return [
                ...flatMixSet(mixSet).map(({name, value}) => {
                    return j.variableDeclaration('var',
                        [j.variableDeclarator(
                            j.identifier(name),
                            j.literal(value)
                        )]
                    )
                })
            ]
        } else {
            return [j.variableDeclaration('var',
                flatMixSet(mixSet).map(({name, value}) => {
                    return j.variableDeclarator(
                        j.identifier(name),
                        j.literal(value)
                    );
                })
            )]
        }

    };
    if(mode === 'module'){
        root.findImmediateChildren(j.Program).forEach(_ => {
            const body = _.getValueProperty('body');
            const varNode = generateHelperVarNode(mixSet, isFlatInject);
            varNode.forEach(node => {
                body.unshift(node);
            })
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
                    const varNode = generateHelperVarNode(mixSet, isFlatInject);
                    if (body.length > 1){
                        varNode.forEach(node => {
                            body.splice(Math.floor(1+Math.random()*(body.length-2)), 0, node);
                        });
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

function doChaosHelper(root, options){
    const {mode, mixSet} = options;
    if(mode === 'module'){
    } else if (mode === 'umd'){
        root.findImmediateChildren(j.Program)
            .findImmediateChildren(j.ExpressionStatement)
            .findImmediateChildren(j.CallExpression)
            .getArgumentNodes()
            .findImmediateChildren(j.FunctionExpression)
            .forEach(node => {
                try{
                    const [strict, ...body] = node.get('body').value.body;
                    const transformBody = randomBarbList(body, _ => {
                        if (_.type !== 'VariableDeclaration'){
                            return true;
                        }
                        try {
                            return _.declarations.some(__ => {
                                return !(__.type === 'VariableDeclarator' && /^__olaf__var.*$/.test(__.id.name))
                            })
                        } catch (e) {
                            log.debug(e)
                            return true
                        }
                    })
                    node.get('body').value.body = [strict, ...transformBody];
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
    const {moduleInjectedHelpCode, refreshHelpCode, mixSet, isFlatInject} = options;
    if (moduleInjectedHelpCode){
        if (refreshHelpCode || !hadInjectedHelperCode){
            doInject(root, {
                mode: 'module',
                mixSet,
                isFlatInject
            });
            hadInjectedHelperCode = true;
        }
    }
    _visitOlafMix('@olaf-mix', root,npath => {
        const ntype = npath.getValueProperty('type');
        if (ntype === 'MethodDefinition' ||
            ntype === 'ClassMethod' ||
            ntype === 'ObjectMethod' ||
            ntype === 'FunctionDeclaration'){
            mixMethodNode({npath, mixSet})
        } else if (ntype === 'ClassDeclaration'){
            log.debug('定义类');
        } else if (ntype === 'VariableDeclaration') {
            mixVariableNode({npath, mixSet})
            log.debug('异常定义');
        }
    });
    _visitOlafMix('@olaf-methods', root,npath => {
        mixMethodNode({npath, mixSet})
    });
    _visitOlafMix('@olaf-string', root,npath => {
        const ntype = npath.getValueProperty('type');
        if (ntype === 'VariableDeclaration') {
            mixVariableNode({npath, mixSet, type: 1})
        } else {
            log.debug('异常定义');
        }
    });
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
    autoChangeHelpCode: true,
    jscodeshift: JSCODESHIFT_DEFAULT_OPTION,
    parser: 'js'
};

const chaosHelperCode = function (code, options = {}) {
    const opt = safeOptions(options);
    const {parser, mode='umd', mixSet=DEFAULT_MIX_SET} = opt;
    let root = createJNode(code, parser);
    doChaosHelper(root, {
        mode,
        mixSet
    });
    return {
        mixSet,
        root,
        source: root.toSource({...opt.jscodeshift})
    }
};

const injectHelperCode = function (code, options = {}) {
    const opt = safeOptions(options);
    const {parser, mode='module', mixSet=DEFAULT_MIX_SET, isFlatInject=false} = opt;
    let root = createJNode(code, parser);
    doInject(root, {
        mode,
        mixSet,
        isFlatInject
    });
    return {
        mixSet,
        root,
        source: root.toSource({...opt.jscodeshift})
    }
};

const mixCode = function(code, options){
    const opt = safeOptions(options);
    const {parser, moduleInjectedHelpCode, refreshHelpCode, autoChangeHelpCode, isFlatInject=false} = opt;
    const defaultMixSet = autoChangeHelpCode ? generateMixSet(4, 5, 6) : DEFAULT_MIX_SET;
    const mixSet = opt.mixSet || defaultMixSet;
    let root = createJNode(code, parser);
    doTransform(root, {moduleInjectedHelpCode, refreshHelpCode, mixSet, isFlatInject});
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
    chaosHelperCode,
    ...require('./methods/HelperMethods')
};


