/*global define sinon module test notStrictEqual strictEqual */
/** See the jQuery Library  (http://jquery.com/) for full details.
 * @class
 * @name $
 * @see <a href="http://jquery.com/">jQuery</a>
 */
/** See the jQuery Library  (http://jquery.com/) for full details.
 * @class
 * @name fn
 * @memberOf $
 * @see <a href="http://jquery.com/">jQuery</a>
 */
/** See the requireJS Library  (http://requirejs.org/) for full details.
 * @class
 * @name define
 * @see <a href="http://requirejs.org/">requireJS</a>
 */
/** Module definition
 * @author BBC <nobody@bbc.co.uk>
 */
define(["jquery", "module", "client"], function($, app, Client) {
    "use strict";

    var client = null,
        config = null,
        sandbox = null;

    module("Client JSONP", {

        // isolate methods under test
        setup: function () {

            // set defaults
            client = new Client();
            sandbox = sinon.sandbox.create();
            config = $.fn.QA.setUp(sandbox, app.config().jsonp);

            // spy test methods
            sandbox.spy(client, "setUp");
            sandbox.spy(client, "connect");

            // set default response to 'success'
            sandbox.stub($, "ajax").yieldsTo("success", config.done);

         },

        // restore methods under test
        teardown: function () {
            $.ajax.restore();
            sandbox.restore();
        }

    });

    test("should be defined", 1, function() {
        notStrictEqual(client, undefined);
    });

    test("should have 'jsonp' dataType", 1, function () {
        client.init(config.args);
        strictEqual(client.args("dataType"), "jsonp");
    });

    test("should have 'application/javascript; charset=UTF-8' contentType", 1, function () {
        client.init(config.args);
        strictEqual(client.args("contentType"), "application/javascript; charset=UTF-8");
    });

    test("should have 'jsonp' disabled", 1, function () {
        client.init(config.args);
        strictEqual(client.args("jsonp"), false);
    });

    test("should have 'callback' disabled", 1, function () {
        client.init(config.args);
        strictEqual(client.args("callback"), false);
    });

    test("should have 'qCallback' jsonpCallback", 1, function () {
        client.init(config.args);
        strictEqual(client.args("jsonpCallback"), "qCallback");
    });

    test("should receive 200 status data", 2, function () {
        sandbox.stub(client, "callback", function (data) {
            strictEqual(client.callback.calledOnce, true);
            strictEqual(data, config.done);
        });
        client.init(config.args);
    });

    test("should receive 404 status data", 2, function () {
        $.ajax.restore();
        sandbox.stub($, "ajax").yieldsTo("error", config.fail);
        sandbox.stub(client, "callback", function (data) {
            strictEqual(client.callback.calledOnce, true);
            strictEqual(data, config.fail);
        });
        client.init(config.args);
    });

});