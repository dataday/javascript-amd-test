/*global define */
define(["jquery", "module"], function($, lib) {
    "use strict";

    return function Client() {

        this.version = "0.0.1";
        this.config = {
            type: "GET",
            cache: true,
            timeout: 30
        };

        var request = function (opts) {
            return $.ajax(opts || {});
        };

        this.args = function (key) {
            if (key && this.config.hasOwnProperty(key)) {
                return this.config[key];
            }
            return this.config;
        };

        this.setUp = function(opts) {
            for (var key in opts) {
                if (opts.hasOwnProperty(key)) {
                    this.config[key] = opts[key];
                }
            }
        };

        this.connect = function (jqXHR, status, msg) {
            if (this.args().hasOwnProperty("url")) {
                return request(this.args());
            }
            this.callback([{"summary": "No URL specified", "title": "Configuration Error", "error": true}]);
        };

        this.callback = function (data, status) {
            return data;
        };

        this.init = function(opts) {
            opts = $.extend({
                success: this.callback,
                error: this.callback
            }, opts || {});
            this.setUp(opts || {});
            return this.connect();
        };

    };

});