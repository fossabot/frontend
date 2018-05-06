# Pomment 访客界面

本项目为 Pomment 提供一个友好的、基本的、可读性高的访客前端界面。

## 快速上手

```html
<div id="my-pomment"></div>
```

然后在页面底部插入以下 JavaScript 代码

```javascript
(function () {
    var myPomment;
    var s = document.createElement('script');
    s.src = 'path/to/pomment.min.js';
    s.onload = function () {
        myPomment = new Pomment(
            '#my-pomment',
            '你的服务器地址，不要以斜杠结尾',
            '你的主题名称'
        );
        myPomment.init();
    }
    document.body.appendChild(s);
})();
```

## 编译

```bash
npm run build           # 生产环境
npm run build-test      # 开发环境
```