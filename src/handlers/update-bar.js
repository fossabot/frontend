import TemplatePartialBarText from '../templates/partial/bar-text.eft';
import TemplatePartialBarLink from '../templates/partial/bar-link.eft';

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
