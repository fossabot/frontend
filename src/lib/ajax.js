/**
 * 发起 AJAX 请求
 * @param {string}      url             要请求的地址
 * @param {string}      method = 'POST' 请求协议
 * @param {object}      headers = {}    请求头部
 * @param {object}      data = null     请求中所提交的数据
 * @param {function}    callback        回调函数
 * @return {undefined}
 */
const ajax = ({
    url,
    method = 'POST',
    headers = {},
    data = null,
} = {}, callback = () => {}) => {
    /**
     * @type {XMLHttpRequest}
     */
    const request = new XMLHttpRequest();
    request.open((typeof method === 'string') ? method : 'POST', url, true);
    request.onload = () => {
        callback(null, request.responseText);
    };
    request.onerror = () => {
        callback('Connection error', null);
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
};

export default ajax;
