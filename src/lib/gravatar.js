const avatarURL = (prefix, hash, baseSize = 56) => `${prefix}${hash}?s=${window.devicePixelRatio * baseSize}`;

export default avatarURL;
