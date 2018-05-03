import TemplateBar from '../elements/bar.eft';
import MinorBarText from '../elements/minor/bar-text.eft';
import MinorBarLink from '../elements/minor/bar-link.eft';

const createBar = (_this, {
    barStyle = 'info',
    type = 'text',
    leftText,
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
            throw new Error('You specified an invaild message type');
        }
    }
    return bar;
};

export default createBar;
