/**
 * 发起 AJAX 请求
 * @param {string}      url             要请求的地址
 * @param {string}      method = 'POST' 请求协议
 * @param {object}      headers = {}    请求头部
 * @param {object}      data = null     请求中所提交的数据
 * @return {Promise}
 */
const ajax = ({
    url,
    method = 'POST',
    headers = {},
    data = null,
} = {}) => new Promise((resolve, reject) => {
    /**
     * @type {XMLHttpRequest}
     */
    const request = new XMLHttpRequest();
    request.open(method, url, true);
    request.onload = () => {
        resolve(request);
    };
    request.onerror = () => {
        reject(new Error('Connection error'));
    };
    if (headers) {
        console.log(headers);
        const itemList = Object.keys(headers);
        for (let i = 0; i < itemList.length; i += 1) {
            request.setRequestHeader(itemList[i], headers[itemList[i]]);
        }
    }
    if (data) {
        request.setRequestHeader('content-type', 'application/json');
        request.send(JSON.stringify(data));
    } else {
        request.send();
    }
});

export default ajax;
