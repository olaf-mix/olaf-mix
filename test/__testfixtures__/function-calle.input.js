class Foo{
    /* @olaf-mix */
    static run(){
        console.log('I want run')
        this.jump();
        window.alert('A alert')
    }
    
    static jump(){
        console.log('I want jump')
    }
}

export default Foo;
