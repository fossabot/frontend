/**
 * 获取 Gravatar 头像地址
 * @param {string} prefix           使用的服务器，以斜杠结尾
 * @param {string} hash             头像对应电子邮箱地址的 MD5 值
 * @param {number} [baseSize = 56]  头像大小。默认 56
 * @returns {string}                最终得到的地址
 */
const avatarURL = (prefix, hash, baseSize = 56) => `${prefix}${hash}?s=${window.devicePixelRatio * baseSize}`;

export default avatarURL;
