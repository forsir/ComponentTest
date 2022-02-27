define(["require", "exports", "./RootComponent"], function (require, exports, RootComponent_1) {
    "use strict";
    exports.__esModule = true;
    window.addEventListener('load', function (event) {
        var rootElement = document.getElementById("app");
        rootElement.innerHTML = "inner element: <div id='inner'>Jedna</div> konec";
        var rootElement1 = document.getElementById("inner");
        rootElement1.innerHTML = "Dva";
        rootElement.innerHTML = "inner element změna: <div id='inner'>Jedna</div> konec";
        rootElement1.innerHTML = "Tři";
        var rootComponent = new RootComponent_1.RootComponent();
        var rootElement = document.getElementById("app");
        rootComponent.setElement(rootElement);
        rootComponent.render();
    });
});
//# sourceMappingURL=App.js.map