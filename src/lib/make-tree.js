import findWithAttr from './find-with-attr';

/**
 * 整理评论树
 * @param {array} dataArr - 未整理的评论树
 * @return {array} - 整理后的评论树
 */
const makeTree = (dataArr) => {
    const data = dataArr;
    if (!Array.isArray(data)) {
        return [];
    }
    let i = 0;
    while (i < data.length) {
        if (data[i].parent && data[i].parent >= 0) {
            const targetPos = findWithAttr(data, 'id', data[i].parent);
            if (data[targetPos]) {
                if (!data[targetPos].slave) data[targetPos].slave = [];
                data[targetPos].slave.push(data[i]);
            }
            data.splice(i, 1);
        } else {
            i += 1;
        }
    }
    return data.reverse();
};

export default makeTree;
