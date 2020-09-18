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
                            body.splice(Math.floor(1 + Math.random()*(body.length-2)), 0, node);
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

const doTransform = function(root, options) {
    log.debug('********************')
    const {moduleInjectedHelpCode, mixSet} = options;
    if (moduleInjectedHelpCode){
        doInject(root, options);
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
    _visitOlafMix('@olaf-method', root,npath => {
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
    autoChangeHelpCode: true,
    jscodeshift: JSCODESHIFT_DEFAULT_OPTION,
    parser: 'js',
    isFlatInject: false,
    mixSet: DEFAULT_MIX_SET,
    mode: 'module',
};

const chaosHelperCode = function (code, options = {}) {
    const opt = safeOptions(options), root = createJNode(code, opt.parser);
    opt.mode = 'umd';
    doChaosHelper(root, opt);
    return {
        mixSet,
        root,
        source: root.toSource({...opt.jscodeshift})
    }
};

const injectHelperCode = function (code, options = {}) {
    const opt = safeOptions(options), root = createJNode(code, opt.parser);
    opt.mode = opt.mode || 'module';
    doInject(root, opt);
    return {
        mixSet,
        root,
        source: root.toSource({...opt.jscodeshift})
    }
};

/**
 * 混淆资源字符串
 * @param code 资源字符串
 * @param options 混淆配置项
 * @return {{root: *, mixSet: *, source: *[]}}
 */
const mixCode = function(code, options){
    const opt = safeOptions(options), root = createJNode(code, opt.parser);
    opt.mixSet = opt.mixSet || (opt.autoChangeHelpCode ? generateMixSet(4, 5, 6) : DEFAULT_MIX_SET);
    doTransform(root, opt);
    return {
        mixSet: opt.mixSet,
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


