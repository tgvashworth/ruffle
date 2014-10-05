'use strict';

var _ = require('fnkit');

var mixins = {};

mixins.base = function base(node, attr) {
    return {
        node: node,
        attr: attr
    };
};

mixins.initialize = function initialize($) {
    $.initialize = function () {};
    setTimeout(function () {
        $.initialize.call($);
    }, 0);
    return $;
};

mixins.attributes = function attributes($) {
    $.attributes = function (data) {
        $.attrs = _.merge(data, $.attrs);
    };
    return $;
};

mixins.advice = function advice($) {
    $.after = function (method, fn) {
        $[method] = $[method] || function () {};
        var original = $[method];
        $[method] = function () {
            var res = _.applyCtx(original, $, _.arr(arguments));
            _.applyCtx(fn, $, _.arr(arguments));
            return res;
        };
    };
    $.before = function (method, fn) {
        $[method] = $[method] || function () {};
        var original = $[method];
        $[method] = function () {
            _.applyCtx(fn, $, _.arr(arguments));
            return _.applyCtx(original, $, _.arr(arguments));
        };
    };
    return $;
};


function wrapListener(cb) {
    return function (e) {
        return cb(e, e.detail);
    };
}

mixins.events = function events($) {
    $.events = {};
    $.events.listeners = [];

    $.on = function (node, type, cb) {
        var wrappedCb = wrapListener(_.bind($, cb));
        node.addEventListener(type, wrappedCb);
        $.events.listeners.push([node, type, wrappedCb]);
        return wrappedCb;
    };

    $.off = function (node, type, cb) {
        node.removeEventListener(type, cb);
    };

    $.trigger = function (node, type, data) {
        node.dispatchEvent(
            new CustomEvent(type, {
                detail: data,
                bubbles: true,
                cancelable: true
            })
        );
    };

    $.after(
        'teardown',
        _.partial(
            _.map,
            _.partial(_.apply, $.off),
            $.events.listeners
        )
    );

    return $;
};

mixins.dom = function dom($) {
    $.select = function (selector) {
        return $.node.querySelector(selector);
    };

    $.selectAll = function (selector) {
        return _.arr($.node.querySelectorAll(selector));
    };

    return $;
};

module.exports = mixins;
