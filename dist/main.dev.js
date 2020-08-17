"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var fs = require('fs');

var path = require('path');

var request = require('./util/request');

var _require = require('./util/index'),
    cookieToJson = _require.cookieToJson;

var obj = {};
fs.readdirSync(path.join(__dirname, 'module')).reverse().forEach(function (file) {
  if (!file.endsWith('.js')) return;

  var fileModule = require(path.join(__dirname, 'module', file));

  obj[file.split('.').shift()] = function (data) {
    if (typeof data.cookie === 'string') {
      data.cookie = cookieToJson(data.cookie);
    }

    return fileModule(_objectSpread({}, data, {
      cookie: data.cookie ? data.cookie : {}
    }), request);
  };
});
module.exports = obj;