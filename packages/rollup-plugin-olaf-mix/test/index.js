import Foo from "./foo.js";

class Bar extends Foo{
    /* @olaf-1mix */
    static mix(params){
       console.log('just a test');
    }
}

export {
    Bar,
};
