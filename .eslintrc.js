module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "no-alert": "off",
        "no-console": "off",
        "no-param-reassign": "off",
        "no-underscore-dangle": 'off',
        "max-len": ["error", 140],
        "indent": ["error", 4],
    },
    "env": {
        "browser": true,
        "node": false,
    }
};