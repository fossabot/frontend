import md5 from 'blueimp-md5';

import ajax from './lib/ajax';
import avatarURL from './lib/gravatar';
import createBar from './handlers/create-bar';
import createComment from './handlers/create-comment';
import makeTree from './lib/make-tree';
import submit from './handlers/submit';
import tranString from './i18n/main';
import updateBar from './handlers/update-bar';

import CSString from './assets/scss/index.scss';
import TemplateForm from './templates/form.eft';
import TemplateMain from './templates/main.eft';

// noinspection JSUnresolvedFunction
const styleIdentify = `pomment-style-${md5(Math.random()).slice(0, 8)}`;

class Pomment {
    /**
     * 创建一个 Pomment 实例
     * @param {string|HTMLElement}  element                 要插入评论框挂件的元素
     * @param {string}              server                  Pomment 服务器地址。不要以 / 结尾
     * @param {string}              thread                  主题的名称
     * @param {string}              [avatarPrefix]          使用的自定义 Gravatar 服务器地址。需要以 / 结尾
     * @param {string}              [title]                 主题的标题
     * @param {string}              [url]                   主题的唯一链接
     * @param {boolean}             [injectCSS]             是否插入内置 CSS
     * @param {function}            [siteConfirmHandler]    确认访问访客提供的链接的确认处理函数
     */
    constructor(element, server, thread, {
        avatarPrefix = 'https://secure.gravatar.com/avatar/',
        title = document.title,
        url = document.location.href,
        injectCSS = true,
        siteConfirmHandler = (target) => {
            if (window.confirm(tranString('msgSiteConfirm', {
                url: target,
            }))) {
                window.open(target);
            }
        },
    } = {}) {
        if (!(element instanceof Element)) {
            this.element = document.querySelector(element);
        } else {
            this.element = element;
        }
        if (typeof this.element.dataset.pomment !== 'undefined') {
            throw new ReferenceError('The element is already loaded as Pomment instance');
        }
        if (injectCSS) {
            if (!document.getElementById(styleIdentify)) {
                const container = document.createElement('style');
                container.id = styleIdentify;
                container.textContent = CSString;
                document.head.appendChild(container);
                console.log('[Pomment]', 'Built-in CSS injected.');
            } else {
                console.warn('[Pomment]', 'The built-in CSS is already injected. Ignoring.');
            }
        }
        this.element.dataset.pomment = 'loaded';
        this.position = -1;
        this.server = server;
        this.thread = thread;
        this.avatarPrefix = avatarPrefix;
        this.title = title;
        this.url = url;
        this.siteConfirmHandler = siteConfirmHandler;
    }
    async init() {
        // 0.   前期准备
        const _this = this;
        // 0.1  环境初始化
        let templateMain;
        if (!templateMain) {
            templateMain = new TemplateMain();
        }
        templateMain.$mount({ target: this.element });
        // 0.2  内容加载
        const barTop = createBar(this, {
            leftText: tranString('msgLoading'),
        });
        templateMain.mpInfoBar = barTop;
        let request;
        try {
            request = await ajax({
                url: `${this.server}/v1/thread/${this.thread}/list`,
            });
        } catch (e) {
            console.error('[Pomment]', e);
            const leftText = tranString('errLoadFailed');
            const rightText = tranString('btnRetry');
            barTop.mpRichInfo.$data = {
                leftText,
            };
            barTop.$data = {
                barStyle: 'error',
                rightText,
            };
            barTop.$methods.eventClick = () => {
                barTop.$destroy();
                _this.init();
            };
            return false;
        }
        const response = JSON.parse(request.responseText);
        console.info('[Pomment]', response);
        barTop.$data.hidden = 'hidden';
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
            displayCancel: 'hidden',
        };
        templateMain.mpForm = templateForm;
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
        const formStatusUpdate = (component, name) => {
            barTop.$data.hidden = '';
            updateBar(barTop, {
                type: 'link',
                leftText: tranString('msgReply', {
                    name,
                }),
                rightText: tranString('btnCancel'),
                leftEvent() {
                    window.scroll({
                        top: component.$element.offsetTop,
                        behavior: 'smooth',
                    });
                },
                rightEvent() {
                    templateForm.$umount();
                    templateForm.$data.displayCancel = 'hidden';
                    templateMain.mpForm = templateForm;
                    barTop.$data.hidden = 'hidden';
                    this.position = -1;
                },
            });
        };
        // 2.   评论树处理
        const dataSorted = JSON.parse(JSON.stringify(makeTree(Object.values(response.content))));
        console.log(dataSorted);
        for (let i = 0; i < dataSorted.length; i += 1) {
            const primary = createComment({
                _this: this,
                main: templateMain,
                form: templateForm,
                formCallback: formStatusUpdate,
                item: dataSorted[i],
                master: true,
                replyable: !response.locked,
            });
            if (dataSorted[i].slave) {
                const slaves = dataSorted[i].slave;
                for (let j = 0; j < slaves.length; j += 1) {
                    primary.slave.push(createComment({
                        _this: this,
                        main: templateMain,
                        form: templateForm,
                        formCallback: formStatusUpdate,
                        item: slaves[j],
                        master: false,
                        replyable: !response.locked,
                    }));
                }
            }
            templateMain.mpComments.push(primary);
        }
        console.info('[Pomment]', templateMain.mpComments);
        // 3.   评论提交相关
        templateForm.$methods.eventSubmit = () => submit(this, templateMain, templateForm, formStatusUpdate);
        return false;
    }
}

// noinspection JSUnusedGlobalSymbols
export default Pomment;
