"use strict";

function jsonp(option) {
  var script = document.createElement('script');
  var fnName = 'fnNnnn' + Math.random().toString().replace('.', '');
  var reqPrm = '';

  for (var attr in option.params) {
    reqPrm += '&' + attr + '=' + option.params[attr];
  }

  script.src = option.url + '?callback=' + fnName + reqPrm;
  window[fnName] = option.success; //这里定义全局响应处理函数，所以不用执行

  document.body.appendChild(script);

  script.onload = function () {
    document.body.removeChild(script);
  };
}