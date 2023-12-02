import {describe, expect, test} from "@jest/globals";
import "./test-component";
import "../index";

describe('ConditionalRenderCasesComponent', () => {
    test('should render default as initial state set to "default"', () => {

        document.body.innerHTML = `<test-component></test-component>`;
        const customElement = document.querySelector("test-component");
        const helloDiv = customElement.shadowRoot.querySelector("[case='hello']") as HTMLElement;
        const worldDiv = customElement.shadowRoot.querySelector("[case='world']") as HTMLElement;
        const defaultDiv = customElement.shadowRoot.querySelector("[case='default']") as HTMLElement;

        expect(helloDiv.style.display).toBe("none");
        expect(worldDiv.style.display).toBe("none");
        expect(defaultDiv.style.display).toBe("block");
    });

    test('should hide and render the selected state when switch', () => {

        document.body.innerHTML = `<test-component></test-component>`;
        const customElement = document.querySelector("test-component");
        const helloDiv = customElement.shadowRoot.querySelector("[case='hello']") as HTMLElement;
        const worldDiv = customElement.shadowRoot.querySelector("[case='world']") as HTMLElement;
        const defaultDiv = customElement.shadowRoot.querySelector("[case='default']") as HTMLElement;

        expect(helloDiv.style.display).toBe("none");
        expect(worldDiv.style.display).toBe("none");
        expect(defaultDiv.style.display).toBe("block");

        customElement.shadowRoot
            .querySelector("conditional-render-cases")
            .setAttribute("state", "world");

        expect(helloDiv.style.display).toBe("none");
        expect(worldDiv.style.display).toBe("block");
        expect(defaultDiv.style.display).toBe("none");


    });

    test('should buttons click should trigger state change on cases', () => {

        document.body.innerHTML = `<test-component-with-buttons></test-component-with-buttons>`;
        const customElement = document.querySelector("test-component-with-buttons");
        const helloDiv = customElement.shadowRoot.querySelector("[case='hello']") as HTMLElement;
        const worldDiv = customElement.shadowRoot.querySelector("[case='world']") as HTMLElement;
        const defaultDiv = customElement.shadowRoot.querySelector("[case='default']") as HTMLElement;

        expect(helloDiv.style.display).toBe("none");
        expect(worldDiv.style.display).toBe("none");
        expect(defaultDiv.style.display).toBe("block");

        (customElement.shadowRoot
            .querySelector("tt-button[world]") as HTMLElement).click();

        expect(helloDiv.style.display).toBe("none");
        expect(worldDiv.style.display).toBe("block");
        expect(defaultDiv.style.display).toBe("none");


    });

});


