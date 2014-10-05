'use strict';

var _ = require('fnkit');

var ruffle = {};
ruffle.mixins = require('./mixins');
ruffle._ = _;
ruffle.utils = _;

/**
 * Core
 */

ruffle.compose = _.reverseArgsTo(_.compose);

// Wrap up an old-style component to be used here
function wrap(fn) {
    return function contextWrapper(x) {
        fn.call(x, x);
        return x;
    };
}

ruffle.base = ruffle.compose(
    ruffle.mixins.base,
    ruffle.mixins.initialize,
    ruffle.mixins.attributes,
    ruffle.mixins.advice,
    ruffle.mixins.events,
    ruffle.mixins.dom
);

/**
 * Framework-specific
 */

// Flight-like
// TODO generalise this so it's easy to add methods to the component function
ruffle.component = function component() {
    return _.through(
        _.apply(
            ruffle.compose,
            ruffle.base,
            _.map(wrap, _.arr(arguments))
        ),
        function (component) {
            component.attachTo = function () {
                // TODO implement multi selector/node stuff
                this.apply(this, arguments);
            };
            return component;
        }
    );
};

ruffle.attach = function ($, selector, attr) {
    return [].map.call(document.querySelectorAll(selector), function (elem) {
        return $(elem, attr);
    });
};

module.exports = ruffle;
