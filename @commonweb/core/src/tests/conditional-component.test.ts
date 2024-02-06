import {describe, expect, test} from "@jest/globals";
import "./test-components";
import "../index";
import {changeStorageValue} from "../storage";


describe('ShowIfComponent', () => {
    test('should NOT render the html pass if the condition is not true', () => {

        document.body.innerHTML =
            // language=HTML
            `
                <div parent>
                    <div value="hide"></div>
                    <h4 value="Show!"></h4>
                    <show-if
                            html="<div projected>Hello World</div>"
                            condition="@div:[value]/=/@h4:[value]">
                    </show-if>
                </div>`;

        const showIfSlotComponent = document.body.querySelector("[projected]") as HTMLElement;
        expect(showIfSlotComponent).toBe(null);

    });
    test('should  render the html pass if the condition is true', () => {

        document.body.innerHTML =
            // language=HTML
            `
                <div parent>
                    <div value="Show!"></div>
                    <h4 value="Show!"></h4>
                    <show-if
                            html="<div projected>Hello World</div>"
                            condition="@div:[value]/=/@h4:[value]">
                    </show-if>
                </div>`;

        const showIfSlotComponent = document.body.querySelector("[projected]") as HTMLElement;
        expect(showIfSlotComponent.innerHTML).toBe(`Hello World`);

    });

    test('[LocalStorage] should  render the html pass if the condition is  true', () => {
        changeStorageValue("user", {role: "ADMIN"});

        document.body.innerHTML =
            // language=HTML
            `
                <div parent>
                    <h4 value="ADMIN"></h4>
                    <show-if
                            html="<div projected>Hello World</div>"
                            condition="localstorage=user.role/=/@h4:[value]">
                    </show-if>
                </div>`;
        const showIfSlotComponent = document.body.querySelector("[projected]") as HTMLElement;
        expect(showIfSlotComponent.innerHTML).toBe(`Hello World`);

    });

    test('[LocalStorage] should  render the html in the parent', () => {
        changeStorageValue("user", {role: "ADMIN"});
        document.body.innerHTML =
            // language=HTML
            `
                <h4 value="ADMIN"></h4>
                <div>
                    <div parent>
                        <show-if
                                html="<div>Hello World</div>"
                                condition="localstorage=user.role/=/@h4:[value]">
                        </show-if>
                    </div>
                </div>`;

        const showIfSlotComponent = document.body.querySelector("[parent]") as HTMLElement;
        expect(showIfSlotComponent.children.length).toBe(2);
        expect(showIfSlotComponent.children[1].tagName).toBe("DIV");
        expect(showIfSlotComponent.children[1].innerHTML).toBe("Hello World");


    });


});


