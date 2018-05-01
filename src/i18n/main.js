import langIndex from './data/index';

/**
 * 客户端使用的语言
 * @type {ReadonlyArray<string>}
 */
const useLang = navigator.languages;

/**
 * 源语言
 * @type {string}
 */
const masterLang = 'en-US';

/**
 * 返回一个正确对于所需语言的 i18n 字段
 * @param {string}      key     i18n 字段名称
 * @param {object}      text    要在字段中被表达的参数
 * @returns {string}    i18n    字段输出
 */
const tranStr = (key, text = {}) => {
    // 1. 确认该用哪里的字段
    let usedLang = masterLang;
    for (let i = 0; i < useLang.length; i += 1) {
        if (typeof langIndex[useLang[i]] !== 'undefined' && typeof langIndex[useLang[i]][key] !== 'undefined') {
            usedLang = useLang[i];
            break;
        }
    }
    // 2. 如果找不到需要的字段
    if (typeof langIndex[usedLang][key] === 'undefined') {
        console.warn(`没有在 ${usedLang} 的翻译文件中找到字段 ${key}`);
        return '';
    }
    // 3. 对于 function 字段
    if (typeof langIndex[usedLang][key] === 'function') {
        return langIndex[usedLang][key](text);
    }
    // 4. 对于 string 字段
    const textKeys = Object.keys(text);
    let output = langIndex[usedLang][key];
    for (let i = 0; i < textKeys.length; i += 1) {
        output = output.replace(new RegExp(`{{${textKeys}}}`, 'gm'), text[textKeys]);
    }
    return output;
}
export default tranStr;
