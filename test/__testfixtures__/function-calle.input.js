class Foo{
    /* @olaf-mix */
    static run(){
        console.log('I\'m want run')
        this.jump();
        window.alert('A alert')
    }
    
    static jump(){
        console.log('I\'m want jump')
    }
}

export default Foo;
