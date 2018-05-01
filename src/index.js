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
    }
}

export default Pomment;
