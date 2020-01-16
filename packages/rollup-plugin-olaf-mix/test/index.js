import Foo from "./foo.js";

class Bar extends Foo{
    /* @olaf-mix */
    static mix(params){
       console.log('just a test');
    }
}

export {
    Bar,
};
