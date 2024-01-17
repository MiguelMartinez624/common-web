import {describe, expect, test} from "@jest/globals";
import "./test-components";
import "../index";
import {changeStorageValue} from "../storage";


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
    test('should  render the html pass if the condition is true', () => {

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

    test('[LocalStorage] should  render the html pass if the condition is  true', () => {
        changeStorageValue("user", {role: "ADMIN"});

        document.body.innerHTML =
            // language=HTML
            `
                <h4 value="ADMIN"></h4>
                <show-if
                        html="<div>Hello World</div>"
                        condition="localstorage=user.role/=/@h4:[value]">
                </show-if>`;

        const showIfSlotComponent = document.querySelector("show-if")
            .shadowRoot
            .querySelector("slot") as HTMLElement;

        expect(showIfSlotComponent.innerHTML).toBe("<div>Hello World</div>");

    });


});


