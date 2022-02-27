define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.rerender = exports.enqueueRender = exports.clearRender = void 0;
    var items = [];
    function clearRender() {
        items = [];
    }
    exports.clearRender = clearRender;
    function enqueueRender(component) {
        if (component.isDirty() && items.push(component) == 1) {
            window.setTimeout(rerender, 0);
        }
    }
    exports.enqueueRender = enqueueRender;
    function rerender() {
        var component, list = items;
        items = [];
        for (var i in list) {
            component = list[i];
            if (component.isDirty() && !component.getParent().isDirty()) {
                component.render();
            }
        }
    }
    exports.rerender = rerender;
});
//# sourceMappingURL=RenderQueue.js.map