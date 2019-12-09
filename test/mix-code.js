const j = require('jscodeshift')
const path = require('path');
const fs = require('fs');
const TEMP = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_#.*-+'
const os = require('os')

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
});

j.registerMethods({
    renameMemberExpressionVariable: function (converMatter = CONVER_NAME_MATTER) {
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
}, j.MemberExpression)

j.registerMethods({
    findImmediateChildren: function(type){
        return this.map(parentPath => {
            return j(parentPath)
                .find(type)
                .filter(p => {
                    return p.parentPath.node === parentPath.node;
                })
                .paths();
        });
    },
}, j.Node)

const CONVER_NAME_MATTER = (oldName) => {
    return `[${oldName.split('').map(_ => `TEMP[${TEMP.indexOf(_)}]`).join('+')}]`;
}

module.exports = function(fileInfo, api, options) {
    console.log('transforming', fileInfo.path);
    const parsed = j(fileInfo.source);
    const outputOptions = {
        quote: 'single'
    }
    console.log('********************')
    // const classCol = parsed.findVariableDeclarators('Bar').renameTo('BarTest');
    // const classCol = parsed.renameClassName('Bar', 'BarTest')
    const a = parsed.find(j.Comment).forEach(_ => {
        const commentValue = _.getValueProperty('value');
        if (!~commentValue.indexOf('@olaf-mix')){
            return;
        } else {
            j(_).replaceWithKey('value', _ =>
                _.value.replace('@olaf-mix', '@olaf-finish'))
        }
        const target = _.parentPath.parentPath;
        const targetCol = j(target)
        const targetType = target.getValueProperty('type');
        console.log(commentValue);
        if (targetType === 'MethodDefinition'){
            console.log('定义方法');
            console.log('**** 方法定义 ****')
            targetCol
                .replaceWithKey('key', _ => {
                    return CONVER_NAME_MATTER(_.getValueProperty('name'));
                })
            console.log('**** 函数定义 ****')
            targetCol
                .find(j.FunctionDeclaration)
                .replaceWithKey('id',  _ => {
                    return CONVER_NAME_MATTER(_.getValueProperty('name'));
                });

            // 处理表达式子树
            console.log('**** 表达式 ****')
            targetCol
                .find(j.BlockStatement)
                .find(j.ExpressionStatement)
                .find(j.Identifier)
                .forEach(_ => {
                    // console.log(_.getValueProperty('name'));
                });
            // 处理变量定义子树
            console.log('**** 变量定义 ****')
            const t = targetCol
                .find(j.BlockStatement)
                .find(j.VariableDeclaration)
                .find(j.Identifier)
                .forEach(_ => {
                    // console.log(_.getValueProperty('name'));
                })

            // 处理 方法调用
            console.log('**** 方法调用 ****')
            const a = targetCol
                .find(j.CallExpression)
                .findImmediateChildren(j.MemberExpression)
                .renameMemberExpressionVariable()
        } else if (targetType === 'ClassDeclaration'){
            console.log('定义类');
        } else {
            console.log('异常定义');
        }
    })
    console.log('--------------------')
    process.env.RUN_MODE === 'debug' && fs.writeFileSync(path.resolve(__dirname, '..', 'dist', '_tmp.js'), parsed.toSource())
    return parsed.toSource();
};


// function transformer(file, api) {
//     const j = api.jscodeshift;
//
//     return j(file.source)
//         .find(j.Identifier)
//         .replaceWith(
//             p => j.identifier(p.node.name.split('').reverse().join(''))
//         )
//         .toSource();
// }
//
// module.exports = transformer;
