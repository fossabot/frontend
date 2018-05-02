import './assets/scss/index.scss';
import ajax from './lib/ajax';
import tranString from './i18n/main';
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
        if (!this.templateMain) {
            this.templateMain = new TemplateMain();
        }
        ajax({
            url: `${this.server}/v1/thread/${this.thread}/list`,
        }, (err, res) => {
            const response = JSON.parse(res);
            this.templateMain.$mount({ target: this.element });
            // 1.   访客表单
            // 1.1  读取存储在 localStorage 的访客信息
            let valueName;
            let valueEmail;
            let valueSite;
            try {
                valueName = localStorage.getItem('PommentName');
                valueEmail = localStorage.getItem('PommentEmail');
                valueSite = localStorage.getItem('PommentSite');
            } catch (e) {
                console.log(`An error occurred while reading localStorage: ${e}`);
                valueName = '';
                valueEmail = '';
                valueSite = '';
            }
            // 1.2  建立表单
            const templateForm = new TemplateForm();
            templateForm.$data = {
                tipName: tranString('tipName'),
                tipEmail: tranString('tipEmail'),
                tipSite: tranString('tipSite'),
                tipContent: tranString('tipContent'),
                btnSubmit: tranString('btnSubmit'),
                btnSubmitting: tranString('btnSubmitting'),
                btnCancel: tranString('btnCancel'),
                valueName,
                valueEmail,
                valueSite,
            };
            this.templateMain.mpForm = templateForm;
            console.log(response);
            templateForm.$methods.eventMetaBlur = ({ state }) => {
                try {
                    localStorage.setItem('PommentName', state.$data.valueName);
                    localStorage.setItem('PommentEmail', state.$data.valueEmail);
                    localStorage.setItem('PommentSite', state.$data.valueSite);
                } catch (e) {
                    console.log(`An error occurred while reading localStorage: ${e}`);
                }
            };
            templateForm.$methods.eventSubmit = ({ state }) => {
                alert(`您输入了以下信息：
用户名：${state.$data.valueName}
邮箱：${state.$data.valueEmail}
主页：${state.$data.valueSite}
内容：${state.$data.valueContent}`);
                return false;
            };
        });
    }
}

// noinspection JSUnusedGlobalSymbols
export default Pomment;
