import MinorBarText from '../elements/minor/bar-text.eft';
import MinorBarLink from '../elements/minor/bar-link.eft';

const updateBar = (bar, {
    barStyle = 'info',
    type = 'text',
    leftText = '',
    rightText = '',
    leftEvent = () => {},
    rightEvent = () => {},
}) => {
    bar.mpRichInfo.$data = {
        leftText,
    };
    bar.$data = {
        barStyle,
        rightText,
    };
    bar.$methods.eventClick = rightEvent;
    bar.mpRichInfo.$destroy();
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
    return false;
};

export default updateBar;
