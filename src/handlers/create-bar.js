import tranString from '../i18n/main';

import TemplateBar from '../templates/bar.eft';
import TemplatePartialBarText from '../templates/partial/bar-text.eft';
import TemplatePartialBarLink from '../templates/partial/bar-link.eft';

const createBar = (_this, {
    barStyle = 'info',
    type = 'text',
    leftText = '',
    rightText = '',
    leftEvent = () => {},
} = {}) => {
    const bar = new TemplateBar({
        $data: {
            barStyle,
            rightText,
        },
    });
    if (rightText === '') {
        bar.$data.rightText = tranString('btnClose');
        bar.$methods.eventClick = () => {
            bar.$destroy();
        };
    }
    switch (type) {
    case 'text': {
        bar.mpRichInfo = new TemplatePartialBarText({
            $data: {
                leftText,
            },
        });
        break;
    }
    case 'link': {
        bar.mpRichInfo = new TemplatePartialBarLink({
            $data: {
                leftText,
            },
        });
        bar.mpRichInfo.$methods.eventClick = leftEvent;
        break;
    }
    default: {
        throw new ReferenceError('You specified an invaild message type');
    }
    }
    return bar;
};

export default createBar;
