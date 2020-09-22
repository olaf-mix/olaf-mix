'use strict';

/**
 * @olaf-mix
 */
Bar.mix = function (params, options) {
    console.log(params);
    Tool.makeTime();
};
return Bar;

/**
 * 数字工具类
 */
class Foo {
    /**
     * 整数补0
     * @param number 整数
     * @param length 最终的长度
     * @returns 整数字符串
     */
    static makeNumber(number, length) {
        return String(number).padStart(length, String(0));
    }

    /**
     * @olaf-mix
     */
    static pickData(data){
        const a = {
            b: {
                c: {
                    d: {
                        e: {
                            f: function (data) {
                                console.log(`data is ${data}`)
                                return `data is ${data}`
                            }
                        }
                    }
                }
            }
        };
        const b = {
            c: 1
        }
        const d = a.b.c.d.e.f(data);
        return a.b.c.d.e.f(data);
    }
}

window.Foo = Foo
