/**
 * 从 ef.js 评论树中找到指定 ID 的评论的具体位置
 * @param {array}   tree  需要进行查找的树
 * @param {number}  id    ID
 * @returns {array}
 */
const searchComment = (tree, id) => {
    for (let i = 0; i < tree.length; i += 1) {
        if (tree[i].$data.id === id) {
            return [i, -1];
        }
        for (let j = 0; j < tree[i].length; j += 1) {
            if (tree[i][j].$data.id === id) {
                return [i, j];
            }
        }
    }
    return [-1, -1];
};

export default searchComment;
