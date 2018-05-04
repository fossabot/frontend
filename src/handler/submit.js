import ajax from '../lib/ajax';
import createBar from './create-bar';
import createComment from './create-comment';
import tranString from '../i18n/main';

const freeze = (form) => {
    form.$data = {
        disabled: 'disabled',
        btnSubmit: tranString('btnSubmitting'),
        disableSubmit: 'disabled',
    };
};

const unFreeze = (form) => {
    form.$data = {
        disabled: '',
        btnSubmit: tranString('btnSubmit'),
        disableSubmit: '',
    };
};

const submit = async (_this, main, form, formCallback) => {
    freeze(form);
    if (form.mpInfoBar) {
        form.mpInfoBar.$umount();
    }
    let request;
    let bar;
    try {
        request = await ajax({
            url: `${_this.server}/v1/thread/${_this.thread}/submit`,
            data: {
                title: _this.title,
                url: _this.url,
                name: form.$data.valueName,
                email: form.$data.valueEmail,
                website: form.$data.valueSite,
                content: form.$data.valueContent,
                parent: _this.position,
            },
        });
    } catch (e) {
        bar = createBar(_this, {
            barStyle: 'error',
            leftText: tranString('errSubmitFailed'),
        });
        form.mpInfoBar = bar;
        unFreeze(form);
        return false;
    }
    const response = JSON.parse(request.responseText);
    console.log('[Pomment]', response);
    if (response.status === 'success') {
        bar = createBar(_this, {
            barStyle: 'success',
            leftText: tranString('msgPostSuccess'),
        });
        form.mpInfoBar = bar;
        if (_this.position < 0) {
            const comment = createComment(
                _this,
                main,
                form,
                formCallback,
                response.content,
                true,
                true,
                true,
            );
            main.mpComments.unshift(comment);
            window.scroll({
                top: comment.$element.offsetTop,
                behavior: 'smooth',
            });
        }
        if (response.coolDownTimeout > 0) {
            let count = response.coolDownTimeout;
            form.$data = {
                disabled: '',
                btnSubmit: tranString('btnWaitCountdown', {
                    timeout: count,
                }),
                disableSubmit: 'disabled',
            };
            const countdown = setInterval(() => {
                count -= 1;
                form.$data.btnSubmit = tranString('btnWaitCountdown', {
                    timeout: count,
                });
                if (count <= 0) {
                    unFreeze(form);
                    clearInterval(countdown);
                }
            }, 1000);
        } else {
            unFreeze(form);
        }
        // main.mpComments
    }
    return false;
};

export default submit;
