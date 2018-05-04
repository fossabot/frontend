import avatarURL from '../lib/gravatar';
import isBlank from '../lib/is-blank';
import timeSince from '../lib/time-since';
import tranString from '../i18n/main';
import MinorName from '../elements/minor/name.eft';
import MinorNameLink from '../elements/minor/name-link.eft';
import TemplateComment from '../elements/comment.eft';

/**
 * 构建评论
 * @param {object}      _this           继承自 Pomment 类的 this
 * @param {object}      main            主元素本体
 * @param {object}      form            表单本体
 * @param {function}    formCallback    表单移动事件回调
 * @param {object}      item            评论信息
 * @param {boolean}     master          是不是第一层评论
 * @param {boolean}     replyable       可以被回复
 * @param {boolean}     editable        可以被编辑
 */
const createComment = (_this, main, form, formCallback, item, master, replyable, editable = false) => {
    const primary = new TemplateComment({
        $data: {
            id: item.id,
            avatar: avatarURL(_this.avatarPrefix, item.emailHashed),
            absoluteTime: item.birth,
            relativeTime: timeSince(new Date(item.birth)).value,
            content: item.content,
            masterBackground: master ? 'bg' : '',
            showReply: replyable ? '' : 'hidden',
            showEdit: editable ? '' : 'hidden',
            // 以下是字段部分
            btnEdit: tranString('btnEdit'),
            btnReply: tranString('btnReply'),
            btnSubmit: tranString('btnSubmit'),
            btnSubmitting: tranString('btnSubmitting'),
            btnCancel: tranString('btnCancel'),
        },
    });
    if (replyable) {
        primary.$methods.eventReply = () => {
            form.$data.displayCancel = 'inline';
            form.$umount();
            primary.mpForm = form;
            formCallback(primary, item.name);
            _this.position = item.id;
        };
        form.$methods.eventCancel = () => {
            form.$data.displayCancel = 'hidden';
            form.$umount();
            main.mpForm = form;
            main.mpInfoBar.$data.hidden = 'hidden';
            _this.position = -1;
        };
    }
    if (isBlank(item.website)) {
        primary.mpPostName = new MinorName({
            $data: {
                content: item.name,
            },
        });
    } else {
        primary.mpPostName = new MinorNameLink({
            $data: {
                content: item.name,
            },
        });
        primary.mpPostName.$methods.eventClick = () => _this.siteConfirmHandler(item.website);
    }
    return primary;
};

export default createComment;
