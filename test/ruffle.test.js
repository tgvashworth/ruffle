'use strict';

var test = require('tape');
var ruffle = require('../ruffle');

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
        function add(str) {
            return function (x) {
                return x + str;
            };
        }
        var fn = ruffle.compose(add('b'), add('c'));
        t.equal(fn('a'), 'abc');
        t.end();
    });
});
