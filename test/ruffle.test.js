'use strict';

var test = require('tape');
var ruffle = require('../ruffle');
var _ = require('fnkit');

test('ruffle', function (t) {
    t.test('ruffle is requireable', function (t) {
        t.ok(ruffle);
        t.end();
    });

    t.test('we are in a browser environment', function (t) {
        t.ok(document);
        t.end();
    });
});

test('ruffle.compose', function (t) {
    t.test('ruffle.compose calls functions in the correct order', function (t) {
        var fn = ruffle.compose(_.partial(_.add, 'b'), _.partial(_.add, 'c'));
        t.equal(fn('a'), 'abc');
        t.end();
    });
});

test('ruffle.mixins.initialize', function (t) {
    t.test('ruffle.mixins.initialize adss initialize to the component', function (t) {
        var c = ruffle.mixins.initialize({});
        t.ok(c.initialize);
        t.ok(typeof c.initialize === 'function');
        t.end();
    });

    t.test('ruffle.mixins.initialize calls initialize after the component is instantiated', function (t) {
        var c = ruffle.mixins.initialize({});
        c.initialize = function () {
            t.pass();
            t.end();
        };
    });
});
