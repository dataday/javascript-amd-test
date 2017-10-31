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

    module("Client", {

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

    test("should initialise in sequence", 1, function () {
        client.init(config.args);
        server.respond();
        strictEqual(client.setUp.calledBefore(client.connect), true);
    });

    test("should initialise methods once", 2, function () {
        client.init(config.args);
        server.respond();
        strictEqual(client.setUp.calledOnce, true);
        strictEqual(client.connect.calledOnce, true);
    });

    test("should have '0.0.1' version", 1, function () {
        client.init(config.args);
        server.respond();
        strictEqual(client.version, "0.0.1");
    });

    test("should have HTTP 'GET' configured", 1, function () {
        client.init(config.args);
        server.respond();
        strictEqual(client.args("type"), "GET");
    });

    test("should have a URL configured", 1, function () {
        client.init(config.args);
        server.respond();
        strictEqual(client.setUp.getCall(0).calledWithMatch({url: config.args.url}), true);
    });

    test("should request the URL configured", 1, function () {
        client.init(config.args);
        server.respond();
        strictEqual(server.requests[0].url, config.request);
    });

    test("should receive 'No URL specified' without a URL", 1, function () {
        sandbox.stub(client, "callback", function (data) {
            strictEqual(data[0].summary, "No URL specified");
        });
        delete config.args.url;
        client.init(config.args);
        server.respond();
    });

});