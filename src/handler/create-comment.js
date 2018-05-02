import avatarURL from '../lib/gravatar';
import isBlank from '../lib/is-blank';
import timeSince from '../lib/time-since';
import tranString from '../i18n/main';
import MinorName from '../elements/minor/name.eft';
import MinorNameLink from '../elements/minor/name-link.eft';
import TemplateComment from '../elements/comment.eft';

/**
 * 构建评论
 * @param {*} _this         继承自 Pomment 类的 this
 * @param {object} item     评论信息
 * @param {boolean} master  是不是第一层评论
 */
const createComment = (_this, item, master) => {
    const primary = new TemplateComment({
        $data: {
            id: item.id,
            avatar: avatarURL(_this.avatarPrefix, item.emailHashed),
            absoluteTime: item.birth,
            relativeTime: timeSince(new Date(item.birth)).value,
            content: item.content,
            masterBackground: master ? 'bg' : '',
            // 以下是字段部分
            btnEdit: tranString('btnEdit'),
            btnReply: tranString('btnReply'),
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
