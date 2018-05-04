import MinorBarText from '../elements/minor/bar-text.eft';
import MinorBarLink from '../elements/minor/bar-link.eft';

const updateBar = (bar, {
    barStyle = 'info',
    type = 'text',
    leftText = '',
    rightText = '',
    leftEvent,
    rightEvent,
}) => {
    bar.mpRichInfo.$data = {
        leftText,
    };
    bar.$data = {
        barStyle,
        rightText,
    };
    if (rightEvent) bar.$methods.eventClick = rightEvent;
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
        if (leftEvent) bar.mpRichInfo.$methods.eventClick = leftEvent;
        break;
    }
    default: {
        throw new ReferenceError('You specified an invaild message type');
    }
    }
    return false;
};

export default updateBar;
