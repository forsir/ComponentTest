import { Dictionary } from "./Common/Dictionary";
import { RootComponent } from "./RootComponent";

declare global {
    interface Window {
        vocabulary: any;
        globalState: any;
        onInputChange(input: HTMLInputElement): void;
    }
}

window.addEventListener('load', (event) => {
    Dictionary.setVocabulary(window.vocabulary || {});

    var rootComponent = new RootComponent(window.globalState);
    var rootElement = document.getElementById("app");
    rootComponent.setElement(rootElement);
    rootComponent.render();
});
