import './assets/scss/index.scss';
import ajax from './lib/ajax';
import TemplateMain from './elements/main.eft';
import TemplateForm from './elements/form.eft';

class Pomment {
    constructor(element, {
        server = null,
        thread = null,
        avatarPrefix = 'https://secure.gravatar.com/avatar/',
        title = document.title,
        url = document.location.href,
    } = {}) {
        if (!(element instanceof Element)) {
            this.element = document.querySelector(element);
        } else {
            this.element = element;
        }
        if (typeof server !== 'string') {
            throw new TypeError('Value `server` is required');
        }
        if (typeof thread !== 'string') {
            throw new TypeError('Value `thread` is required');
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
        ajax({
            url: `${this.server}/v1/thread/${this.thread}/list`,
        }, (err, res) => {
            const response = JSON.parse(res);
            const templateForm = new TemplateForm();
            this.templateMain = new TemplateMain();
            this.templateMain.$mount({ target: this.element });
            this.templateMain.mpForm = templateForm;
            console.log(response);
        });
    }
}

// noinspection JSUnusedGlobalSymbols
export default Pomment;
