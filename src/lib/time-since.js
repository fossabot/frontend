import tranStr from '../i18n/main';

const gapList = [
    { min: 0, suffix: 'timeSinceSecond' },
    { min: 60, suffix: 'timeSinceMinute' },
    { min: 3600, suffix: 'timeSinceHour' },
    { min: 86400, suffix: 'timeSinceDay' },
    { min: 604800, suffix: 'timeSinceWeek' },
    { min: 2592000, suffix: 'timeSinceMonth' },
    { min: 31536000 },
];

/**
 * 将时间转换成相对表达
 * @param {object} date     要转换的目标时间的 Date 对象
 * @return {object}         处理结果
 */
const timeSince = (date) => {
    const gap = (new Date().getTime() - date.getTime()) / 1000;
    for (let i = 0; i < gapList.length - 1; i += 1) {
        if (gap >= gapList[i].min && gap < gapList[i + 1].min) {
            const divise = i === 0 ? 1 : gapList[i].min;
            const ago = Math.floor(gap / divise);
            if (i === 0 && ago <= 3) {
                return {
                    value: tranStr('timeSinceJustNow'),
                    outBound: false,
                }
            }
            return {
                value: `${tranStr(gapList[i].suffix, {
                    ago: ago || '0',
                })}`,
                outBound: false,
            };
        }
    }
    /**
     * @typedef {object}                处理结果
     * @property {string} value         渲染得到的文本表达
     * @property {boolean} outBound     是否在可以被相对表达的范围以内
     */
    return {
        value: tranStr('timeSinceOther', {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
        }),
        outBound: true,
    };
};

export default timeSince;
