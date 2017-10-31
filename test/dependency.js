/*global define module test notStrictEqual strictEqual */
/** Module definition
 * @author BBC <nobody@bbc.co.uk>
 */
define(["jquery", "module", "dependency"], function($, app, dependency) {
    "use strict";

    module("Dependency");

    test("should be defined", 1, function() {
        notStrictEqual(dependency, undefined);
    });

    test("should have a 'ready' property", 1, function() {
        notStrictEqual(dependency.ready, undefined);
    });

    test("should have 'ready' set to true", 1, function() {
        strictEqual(dependency.ready, true);
    });

});