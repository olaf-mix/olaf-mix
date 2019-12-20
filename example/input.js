'use strict';

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
    static getAccount(){
        const a = {};
        return a.b.c.d.e.f('account');
    }
}

export default Foo;
