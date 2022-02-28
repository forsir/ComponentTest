"use strict";
exports.__esModule = true;
var Dictionary_1 = require("./Common/Dictionary");
var RootComponent_1 = require("./RootComponent");
window.addEventListener('load', function (event) {
    console.log("app start");
    Dictionary_1.Dictionary.setVocabulary(window.vocabulary || {});
    var rootComponent = new RootComponent_1.RootComponent(window.globalState);
    var rootElement = document.getElementById("app");
    rootComponent.setElement(rootElement);
    rootComponent.render();
});
//# sourceMappingURL=App.js.map