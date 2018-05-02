/**
 * 安全文本替换
 * @param {string} target   要替换的字符串
 * @param {string} from     把……
 * @param {string} to       替换成……
 * @returns {string}
 */
const safeReplace = (target, from, to) => target.split(from).join(to);

export default safeReplace;
