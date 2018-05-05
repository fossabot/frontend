import ajax from '../lib/ajax';
import createBar from './create-bar';
import createComment from './create-comment';
import searchComment from './search-comment';
import tranString from '../i18n/main';

import TemplateCommentEdit from '../elements/comment-edit.eft';

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
        form.mpInfoBar = createBar(_this, {
            barStyle: 'error',
            leftText: tranString('errSubmitFailed'),
        });
        unFreeze(form);
        return false;
    }
    const response = JSON.parse(request.responseText);
    console.log('[Pomment]', response);
    if (response.status === 'success') {
        form.mpInfoBar = createBar(_this, {
            barStyle: 'success',
            leftText: tranString('msgPostSuccess'),
        });
        const comment = createComment({
            _this,
            main,
            form,
            formCallback,
            item: response.content,
            master: true,
            replyable: true,
        });
        comment.$data.focus = 'focus';
        if (_this.position < 0) {
            main.mpComments.unshift(comment);
        } else {
            comment.$data.masterBackground = '';
            const target = searchComment(main.mpComments, _this.position);
            console.log(target);
            main.mpComments[target].slave.push(comment);
        }
        window.scroll({
            top: comment.$element.offsetTop,
            behavior: 'smooth',
        });
        if (response.gusetEditTimeout >= 0) {
            comment.$data.showEdit = '';
            comment.mpEdit = new TemplateCommentEdit({
                $data: {
                    btnSubmit: tranString('btnSubmit'),
                    btnSubmitting: tranString('btnSubmitting'),
                    btnCancel: tranString('btnCancel'),
                    original: response.content.content,
                },
            });
            comment.mpEdit.$methods.eventCancel = () => {
                comment.$data.hidden = '';
                comment.mpEdit.$data.hidden = 'hidden';
            };
            comment.$methods.eventEdit = () => {
                comment.$data.hidden = 'hidden';
                comment.mpEdit.$data.hidden = '';
            };
            if (response.gusetEditTimeout > 0) {
                // tbs
            }
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
    } else {
        let leftText;
        if (response.info.indexOf('bad') === 0) {
            leftText = tranString('errBadInfo');
        } else if (response.info.indexOf('disallowed') === 0) {
            leftText = tranString('errDisallowedInfo');
        } else if (response.info === 'locked') {
            leftText = tranString('errLocked');
        } else if (response.info === 'please wait') {
            leftText = tranString('errWait', {
                gap: Math.ceil(response.timeLeft),
            });
        } else {
            leftText = tranString('errOther', {
                info: response.info,
            });
        }
        form.mpInfoBar = createBar(_this, {
            barStyle: 'error',
            leftText,
        });
        unFreeze(form);
    }
    return false;
};

export default submit;
