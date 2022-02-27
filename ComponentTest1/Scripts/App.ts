import { RootComponent } from "./RootComponent";

window.addEventListener('load', (event) => {
    var rootElement = document.getElementById("app");
    rootElement.innerHTML = "inner element: <div id='inner'>Jedna</div> konec";
    var rootElement1 = document.getElementById("inner");
    rootElement1.innerHTML = "Dva";
    rootElement.innerHTML = "inner element změna: <div id='inner'>Jedna</div> konec";
    rootElement1.innerHTML = "Tři";

    var rootComponent = new RootComponent();
    var rootElement = document.getElementById("app");
    rootComponent.setElement(rootElement);
    rootComponent.render();
});
