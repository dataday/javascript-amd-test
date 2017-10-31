/*global require QUnit */
["dependency", "client", "client.json", "client.jsonp"].map(function (id) {
    "use strict";
    require(["../test/" + id], function () {
        QUnit.start();
    });
});