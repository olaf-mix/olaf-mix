class Foo{
    static TEST(){
        return this.run() === 'I want jump'
    }

    /* @olaf-mix */
    static run(){
        return `${this.jump()}`;
    }
    
    static jump(){
        return 'I want jump'
    }

}

module.exports = Foo
