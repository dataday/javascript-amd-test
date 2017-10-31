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
        server = null,
        sandbox = null;

    module("Client JSON", {

        // isolate methods under test
        setup: function () {

            // set defaults
            client = new Client();
            sandbox = sinon.sandbox.create();
            server = sandbox.useFakeServer();
            config = $.fn.QA.setUp(sandbox, app.config().json);

            // spy test methods
            sandbox.spy(client, "setUp");
            sandbox.spy(client, "connect");

            // mock 404 response
            server.respondWith("GET", /^.+?\/get\.json$/, function (xhr, id) {
               xhr.respond(404, {"Content-Type": config.args.contentType}, config.fail);
            });

            // mock 200 response
            server.respondWith("GET", /^.+?\/get\.json\?q=([^&]+)$/, function (xhr, id) {
               xhr.respond(200, {"Content-Type": config.args.contentType}, config.done);
            });

         },

        // restore methods under test
        teardown: function () {
            sandbox.restore();
            server.restore();
        }

    });

    test("should be defined", 1, function() {
        notStrictEqual(client, undefined);
    });

    test("should have 'json' dataType", 1, function () {
        client.init(config.args);
        server.respond();
        strictEqual(client.args("dataType"), "json");
    });

    test("should have 'application/json; charset=UTF-8' contentType", 1, function () {
        client.init(config.args);
        server.respond();
        strictEqual(client.args("contentType"), "application/json; charset=UTF-8");
    });

    test("should request 'application/json; charset=UTF-8' Content-Type", 1, function () {
        client.init(config.args);
        server.respond();
        strictEqual(server.requests[0].requestHeaders["Content-Type"], "application/json; charset=UTF-8");
    });

    test("should receive 'application/json; charset=UTF-8' Content-Type", 1, function () {
        client.init(config.args);
        server.respond();
        strictEqual(server.requests[0].responseHeaders["Content-Type"], "application/json; charset=UTF-8");
    });

    test("should receive 200 status", 1, function () {
        client.init(config.args);
        server.respond();
        strictEqual(server.requests[0].status, 200);
    });

    test("should receive 200 status data", 1, function () {
        client.init(config.args);
        server.respond();
        strictEqual(server.requests[0].responseText, config.done);
    });

    test("should receive 200 status 'done' callback", 2, function () {
        sandbox.stub(client, "callback", function (data, status) {
            strictEqual(JSON.stringify(data), config.done);
        });
        client.init(config.args);
        server.respond();
        strictEqual(client.callback.calledOnce, true);
    });

    test("should receive 404 status", 1, function () {
        delete config.args.data;
        client.init(config.args);
        server.respond();
        strictEqual(server.requests[0].status, 404);
    });

    test("should receive 404 status data", 1, function () {
        delete config.args.data;
        client.init(config.args);
        server.respond();
        strictEqual(server.requests[0].responseText, config.fail);
    });

    test("should receive 404 status 'fail' callback", 2, function () {
        sandbox.stub(client, "callback", function (data, status) {
            strictEqual(data.responseText, config.fail);
        });
        delete config.args.data;
        client.init(config.args);
        server.respond();
        strictEqual(client.callback.calledOnce, true);
    });

});