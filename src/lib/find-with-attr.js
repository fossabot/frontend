/**
 * 查找以对象为内容的数组中含有特定值的一项，包括 slave
 * @param {array} arr       需要查询的数组
 * @param {string} attr     需要查询的数组键值
 * @param {*} value         需要查询的值
 * @param {boolean} allow3D 允许查找子内容
 * @return {number}         它在哪里；如果没有找到则返回 -1
 */
const findWithAttr = (arr, attr, value, allow3D = true) => {
    const array = arr;
    for (let i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
        if (allow3D && array[i].slave) {
            for (let j = 0; j < array[i].slave.length; j += 1) {
                if (array[i].slave[j][attr] === value) {
                    return i;
                }
            }
        }
    }
    return -1;
};

export default findWithAttr;
