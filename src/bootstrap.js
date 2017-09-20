import { isAndroid, isIPhone, isWeiXin } from './util/judgePlatform.js';
import { ViewPDF } from './util/pdfViewer.js';

import './main.scss';
import '../static/assets/css/main.scss';
import '../static/assets/vendor/flexible.js';
import '../static/assets/vendor/normalize.min.scss';
import $ from 'webpack-zepto';

/**
 * 获取 query 中参数
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
let url = getQueryString("url");
if (!url) {
    $("#dowLoadFile").hide();
    alert("下载链接不合法！")
} else {
    $('#dowLoadFile').attr("href", url);
    $('#dowLoadFile').on('click', function (evt) {
        if (isWeiXin()) {
            $('.pop-layer').addClass('show');
            var scrollHeight = document.body.scrollHeight;
            $('.pop-layer').css('height', scrollHeight);
            evt.preventDefault();
            return false;
        }
    });

    $('.close-pop-layer').on('click', function (evt) {
        // 防点击穿透事件
        setTimeout(function () {
            $('.pop-layer').removeClass('show');
        }, 350);
    });
    ViewPDF(url);

}

