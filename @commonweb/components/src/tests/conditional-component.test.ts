import {describe, expect, test} from "@jest/globals";
import "./test-component";
import "../index";
import {ShowIfComponent} from "../conditional";

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


describe('ShowIfComponent', () => {
    test('should NOT render the html pass if the condition is not true', () => {

        document.body.innerHTML =
            // language=HTML
        `
            <div value="hide"></div>
            <h4 value="Show!"></h4>
            <show-if
                    html="<div>Hello World</div>"
                    condition="@div:[value]/=/@h4:[value]">
            </show-if>`;

        const showIfSlotComponent = document.querySelector("show-if")
            .shadowRoot
            .querySelector("slot") as HTMLElement;

        expect(showIfSlotComponent.innerHTML).toBe("");

    });
    test('should  render the html pass if the condition is not true', () => {

        document.body.innerHTML =
            // language=HTML
            `
            <div value="Show!"></div>
            <h4 value="Show!"></h4>
            <show-if
                    html="<div>Hello World</div>"
                    condition="@div:[value]/=/@h4:[value]">
            </show-if>`;

        const showIfSlotComponent = document.querySelector("show-if")
            .shadowRoot
            .querySelector("slot") as HTMLElement;

        expect(showIfSlotComponent.innerHTML).toBe("<div>Hello World</div>");

    });

});


