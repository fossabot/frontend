const ajax = ({
    url,
    method = 'POST',
    headers,
    data,
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
