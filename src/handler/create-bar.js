import tranString from '../i18n/main';

import TemplateBar from '../templates/bar.eft';
import MinorBarText from '../templates/minor/bar-text.eft';
import MinorBarLink from '../templates/minor/bar-link.eft';

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
        bar.mpRichInfo = new MinorBarText({
            $data: {
                leftText,
            },
        });
        break;
    }
    case 'link': {
        bar.mpRichInfo = new MinorBarLink({
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
