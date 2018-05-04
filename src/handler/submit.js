import ajax from '../lib/ajax';
import tranString from '../i18n/main';

const submit = async (_this, main, form) => {
    form.$data = {
        disabled: 'disabled',
        btnSubmit: tranString('btnSubmitting'),
        disableSubmit: 'disabled',
    };
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
        alert('aaaaaaaa!!!');
    }
    const response = JSON.parse(request.responseText);
    alert(request.responseText);
};

export default submit;
