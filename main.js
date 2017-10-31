/*global require define jstestdriver */
(function () {
    "use strict";

    /** @namespace require */
    require.config({

        /* Base URL */
        baseUrl: (typeof jstestdriver !== "undefined") ? "/test/src" : "./src",

        /* Module paths */
        paths: {
            jquery: [
                "external/jquery-1.7.2.min",
                "http://code.jquery.com/jquery-1.7.2.min"
            ]
        },

        /* Module mappings */
        map: {
            "*": {
                "utils": "../test/lib/utils",
                "client": "client-0.0.1"
            }
        }

    });

    /** Module configuration */
    define("main", function () {

        var app = {
            version: "0.0.1"
        };

        /** Format property assignments. */
        app.formats = {
            json: {
                args: {
                    url: "http://localhost:4224/test/get.json",
                    contentType: "application/json; charset=UTF-8",
                    dataType: "json",
                    data: {q: "query"}
                }
            },
            jsonp: {
                args: {
                    url: "http://sub.localhost:4224/test/get.jsonp",
                    contentType: "application/javascript; charset=UTF-8",
                    jsonpCallback: "qCallback",
                    dataType: "jsonp",
                    data: {q: "query"},
                    callback: false,
                    jsonp: false
                }
            }
        };

        /** RequireJS module.config() assignments. */
        app.config = {
            "/test/test/client.js": app.formats,
            "/test/test/client.json.js": app.formats,
            "/test/test/client.jsonp.js": app.formats
        };

        return app;

    });

    /** RequireJS module.config() assignments */
    require(["jquery", "main", "utils"], function ($, main) {
        require.config({
            config: $.fn.QA.init(main).config || {}
        });
    });

})();