"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tools = exports.tools = function () {
    function tools() {
        _classCallCheck(this, tools);
    }
    /**
     * 设置指定位置的比特
     * @param {*} value 指定数字
     * @param {*} changeIndex 指定位置
     * @param {*} aimBit 目标比特
     */


    _createClass(tools, [{
        key: "SetBit",
        value: function SetBit(value, changeIndex, aimBit) {
            return value & ~(1 << changeIndex) | aimBit << changeIndex;
        }
        /**
         * 获取指定位置上的比特位
         * @param {*} value 指定的数字
         * @param {*} index 指定的位置
         */

    }, {
        key: "GetBit",
        value: function GetBit(value, index) {
            return value >> index & 1;
        }
    }]);

    return tools;
}();