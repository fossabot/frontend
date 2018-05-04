const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default {
    __name__: 'English',
    msgClosed: 'This thread is locked by the admin.',
    msgFromDeletedPost: 'Deleted Post',
    msgLoading: 'Loading Pomment ...',
    msgPostSuccess: 'Post successfully submitted.',
    msgReply: "You are replying {{name}}'s post.",
    msgSiteConfirm(data) {
        return `You are going to open a URL provided by a guest.
Domain: ${data.domain}
URL: ${data.url}

Are you sure? Visiting websites from unknown origin has risk.`;
    },
    tipAvatar: '{{name}}\'s avatar',
    tipContent: 'Why not say something?',
    tipEmail: 'Email',
    tipName: 'Name',
    tipSite: 'Website',
    btnCancel: 'Cancel',
    btnClose: 'Close',
    btnEdit: 'Edit',
    btnOkay: 'Get it!',
    btnReply: 'Reply',
    btnRetry: 'Retry',
    btnSubmit: 'Submit',
    btnSubmitCountdown: 'Submit ({{timeOut}})',
    btnSubmitTimeOut: 'Time Out',
    btnSubmitting: 'Submitting ...',
    errBadInfo: 'The information you provided is invalid.',
    errBadSubmit: 'You did an illegal operation.',
    errDisallowedInfo: 'Inappropriate content in the information you provided.',
    errLoadFailed: 'Failed to load Pomment.',
    errLocked: 'The thread is locked by an administrator.',
    errOther: 'Unexpected error occurred: {{info}}',
    errTimeExpired: 'Time out.',
    timeSinceJustNow: 'Just now',
    timeSinceSecond: '{{ago}} seconds ago',
    timeSinceMinute: '{{ago}} minutes ago',
    timeSinceHour: '{{ago}} hours ago',
    timeSinceDay: '{{ago}} days ago',
    timeSinceWeek: '{{ago}} weeks ago',
    timeSinceMonth: '{{ago}} months ago',
    timeSinceOther(data) {
        return `${month[data.month - 1]} ${data.day}, ${data.year}`;
    },
};
