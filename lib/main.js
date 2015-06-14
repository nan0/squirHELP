

var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

var button = buttons.ActionButton({
    id: "mozilla-link",
    label: "Visit Mozilla",
    icon: {
        "16": "./pic/icon-16.png",
        "32": "./pic/icon-32.png",
        "64": "./pic/icon-64.png"
    },
    onClick: function() {
        require("sdk/tabs").activeTab.attach({
            contentScriptFile: "./js/compute.js"
        });
    }

});

