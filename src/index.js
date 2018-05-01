import './assets/scss/index.scss';
import ajax from './lib/ajax';
import TemplateMain from './elements/main.eft';
import TemplateForm from './elements/form.eft';

class Pomment {
    constructor(element, server, thread, {
        avatarPrefix = 'https://secure.gravatar.com/avatar/',
        title = document.title,
        url = document.location.href,
    } = {}) {
        if (!(element instanceof Element)) {
            this.element = document.querySelector(element);
        } else {
            this.element = element;
        }
        if (typeof this.element.dataset.pomment !== 'undefined') {
            throw new Error('The element is already loaded as Pomment instance');
        }
        this.element.dataset.pomment = 'loaded';
        this.server = server;
        this.thread = thread;
        this.avatarPrefix = avatarPrefix;
        this.title = title;
        this.url = url;
    }
    init() {
        if (this.templateMain) {
            this.templateMain = new TemplateMain();
        }
        ajax({
            url: `${this.server}/v1/thread/${this.thread}/list`,
        }, (err, res) => {
            const response = JSON.parse(res);
            // 访客表单
            const templateForm = new TemplateForm();
            this.templateMain.$mount({ target: this.element });
            this.templateMain.mpForm = templateForm;
            console.log(response);
            templateForm.$methods.eventSubmit = ({ state }) => {
                alert(`您输入了以下信息：
用户名：${state.$data.valueName}
邮箱：${state.$data.valueEmail}
主页：${state.$data.valueHomePage}
内容：${state.$data.valueContent}`);
                return false;
            };
        });
    }
}

// noinspection JSUnusedGlobalSymbols
export default Pomment;
