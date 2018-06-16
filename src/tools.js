/**
 * 设置指定位置的比特
 * @param {*} value 指定数字
 * @param {*} changeIndex 指定位置
 * @param {*} aimBit 目标比特
 */
export function SetBit(value, changeIndex, aimBit) {
    return (value & ~(1 << changeIndex)) | (aimBit << changeIndex);
}
/**
 * 获取指定位置上的比特位
 * @param {*} value 指定的数字
 * @param {*} index 指定的位置
 */
export function GetBit(value, index) {
    return value >> index & 1;
}
