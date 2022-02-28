import { ComponentOptions } from "./Component";
import { Dictionary } from "./Dictionary";
import { RootComponent } from "./RootComponent";

declare global {
    interface Window {
        vocabulary: any;
        globalState: any;
        resolution: string;
        onInputChange(input: HTMLInputElement): void;
    }
}

window.addEventListener('load', (event) => {
    console.log("app start");

    Dictionary.setVocabulary(window.vocabulary || {});

    var rootComponent = new RootComponent(window.globalState);
    var rootElement = document.getElementById("app");
    rootComponent.setElement(rootElement);
    rootComponent.render();
});
