/**
 * 平台判断
 */

function isAndroid() {
    return window.navigator.appVersion.match(/android/gi);
}

function isIPhone() {
    return window.navigator.appVersion.match(/iphone/gi);
}
function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}
export { isAndroid, isIPhone, isWeiXin }