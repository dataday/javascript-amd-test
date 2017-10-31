/*global define require QUnit */
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
 * @version 0.0.1
 * @author BBC <nobody@bbc.co.uk>
 */
define(["jquery"], function ($) {
    /** @scope define */
    //"use strict";

    $.noConflict();

    /** Collection of helper methods
     * @class
     * @version 0.0.1
     * @memberOf $.fn
     */
    $.fn.QA = $.extend(true, $.fn.QA, {
        /** @scope $.fn.QA */

        /** Module version
         * @type String='0.0.1'
         */
        version: "0.0.1",

        /** Called to generate JSON fixtures
         * @public
         * @function
         * @type Function
         * @param {Object} opts Custom properties, eg, number of fixtures, etc
         * @returns {String} A collection of fixtures
         */
        fixture: function (opts) {

            var results = [],
                args = $.extend(true, {
                    type: "json",
                    key: "done",
                    num: 1,
                    data: {
                        json: {
                            done: '{"url":"http://localhost:4224/test/","summary":"Summary","title":"Title"}',
                            fail: '{"error":true,"summary":"Summary","title":"Title"}'
                        }
                    }
                }, opts || {});

            $.each(new Array(args.num), function (i, e) {
                var key = args.key,
                    type = args.type,
                    data = args.data;
                if (key && data.hasOwnProperty(type)) {
                    results.push(data[type][key]);
                }
            });

            if (args.type === "json") {
                return '[' + results.toString() + ']';
            }

            return results.toString();

        },

        /** Establish "done" and "fail" state properties
         * @public
         * @function
         * @type Function
         * @param {Sinon:Object} sandbox Instance of Sinon.JS object
         * @param {Object} data Configuration properties
         * @returns {Sinon:Object} Instance of Sinon.JS object
         * @see <a href="http://sinonjs.org/">Sinon.JS</a>
         */
        setUp: function (sandbox, data) {
            var config = $.extend(true, {}, data);
            config.done = this.fixture({num:3});
            config.fail = this.fixture({key:"fail"});
            config.request = config.args.url + '?q=' + config.args.data.q;
            return sandbox.stub(config);
        },

        /** Filter for environment specific paths
         * @public
         * @function
         * @type Function
         * @param {Object} main Original path mapping properties
         * @returns {Object} Path mapping properties
         */
        init: function (main) {
            if (typeof jstestdriver === "undefined") {
                for (var id in main.config) {
                    if (id) {
                        main.config[id.replace(/^\/test/, "..").replace(/\.js$/, "")] = main.config[id];
                        delete main.config[id];
                    }
                }
            }
            return main;
        }

    });

});