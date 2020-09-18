class Foo{
    static TEST(){
        return this.run() === 'I want Jump';
    }

  /* @olaf-mix */
    static run(){
        function jump() {
            return 'I want Jump'
        }
        return jump()
    }
}

module.exports = Foo;
