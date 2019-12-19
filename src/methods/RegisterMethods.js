const j = require('jscodeshift');
const {CONVER_IDENTIFIER_TO_STRING_EXPRESSION,
    CONVER_LITERAL_MATTER,
    CONVER_LITERAL_TO_BUFFER_MATTER} = require('./converMethods');

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
    findImmediateChildren: function(type, filter){
        if (!this.isOfType(j.Node)) return [];
        return this.map(parentPath => {
            return j(parentPath)
                .find(type)
                .filter(p => {
                    if (filter && !filter(p)){
                        return false;
                    }
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
    refactorLiteralValue: function (type = 0) {
        // type === 0
        if (!type){
            return this.replaceWith(p => CONVER_LITERAL_MATTER(p))
        } else if (type === 1){
            return this.replaceWith(p => CONVER_LITERAL_TO_BUFFER_MATTER(p))
        } else {
            return type;
        }
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
