import md5 from 'blueimp-md5';

import './assets/scss/index.scss';
import ajax from './lib/ajax';
import avatarURL from './lib/gravatar';
import createBar from './handler/create-bar';
import createComment from './handler/create-comment';
import makeTree from './lib/make-tree';
import tranString from './i18n/main';
import TemplateForm from './elements/form.eft';
import TemplateMain from './elements/main.eft';

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
    async init() {
        // 0.   前期准备
        // 0.1  环境初始化
        if (!this.templateMain) {
            this.templateMain = new TemplateMain();
        }
        this.templateMain.$mount({ target: this.element });
        // 0.2  内容加载
        const barTop = createBar(this, {
            leftText: tranString('msgLoading'),
        });
        this.templateMain.mpInfoBar = barTop;
        let request;
        try {
            request = await ajax({
                url: `${this.server}/v1/thread/${this.thread}/list`,
            });
        } catch (e) {
            console.info('[Pomment]', `${e}`);
        }
        const response = JSON.parse(request.responseText);
        console.info('[Pomment]', response);
        // 1.   访客表单
        // 1.1  读取存储在 localStorage 的访客信息
        let valueName;
        let valueEmail;
        let valueSite;
        try {
            valueName = localStorage.getItem('PommentName') || '';
            valueEmail = localStorage.getItem('PommentEmail') || '';
            valueSite = localStorage.getItem('PommentSite') || '';
        } catch (e) {
            console.error(`An error occurred while reading localStorage: ${e}`);
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
            avatarSource: avatarURL(this.avatarPrefix, md5(valueEmail)),
        };
        this.templateMain.mpForm = templateForm;
        templateForm.$methods.eventMetaBlur = ({ state }) => {
            ({ valueName, valueEmail, valueSite } = state.$data);
            try {
                localStorage.setItem('PommentName', valueName);
                localStorage.setItem('PommentEmail', valueEmail);
                localStorage.setItem('PommentSite', valueSite);
            } catch (e) {
                console.error(`An error occurred while saving localStorage: ${e}`);
            }
            state.$data.avatarSource = avatarURL(this.avatarPrefix, md5(valueEmail));
        };
        // 2.   评论树处理
        const dataSorted = makeTree(Object.values(response.content));
        console.log(dataSorted);
        for (let i = 0; i < dataSorted.length; i += 1) {
            const primary = createComment(this, dataSorted[i], true, !response.locked);
            if (dataSorted[i].slave) {
                const slaves = dataSorted[i].slave;
                for (let j = 0; j < slaves.length; j += 1) {
                    primary.slave.push(createComment(this, slaves[j], false, !response.locked));
                }
            }
            this.templateMain.mpComments.push(primary);
        }
        console.info('[Pomment]', this.templateMain.mpComments);
    }
}

// noinspection JSUnusedGlobalSymbols
export default Pomment;
