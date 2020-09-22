class Foo{
    static TEST(){
        const foo = new Foo();
        /**
         * @olaf-mix
         * 测试方法
         * @return {string}
         */
        foo.say = function () {
            return 'say'
        };

        /**
         * @olaf-mix
         * 测试方法
         * @return {string}
         */
        foo.hi = function hi() {
            return 'hi'
        };

        return foo.say() + foo.hi() === 'sayhi'
    }
}


module.exports = Foo
