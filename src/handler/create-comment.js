import isBlank from '../lib/is-blank';
import timeSince from '../lib/time-since';
import MinorName from '../elements/minor/name.eft';
import MinorNameLink from '../elements/minor/name-link.eft';
import TemplateComment from '../elements/comment.eft';

const createComment = (_this, item, master) => {
    const primary = new TemplateComment({
        $data: {
            avatarSource: avatarURL(_this.avatarPrefix, item.emailHashed),
            absoluteTime: item.birth,
            masterBackground: master ? 'bg' : '',
            relativeTime: timeSince(new Date(item.birth)).value,
            btnSubmit: tranString('btnSubmit'),
            btnSubmitting: tranString('btnSubmitting'),
            btnCancel: tranString('btnCancel'),
        },
    });
    if (isBlank(item.website)) {
        primary.mpPostName = new MinorName({
            $data: {
                content: item.name,
            },
        });
    } else {
        primary.mpPostName = new MinorNameLink({
            $data: {
                url: item.website,
                content: item.name,
            },
        });
    }
    return primary;
};

export default createComment;
