import Foo from "./foo";

class Bar extends Foo{
    /* @olaf-mix */
    static mix(params: number, options: any){
        console.log(params);
    }
}


export {
    Bar,
};
