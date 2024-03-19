import {describe, expect, test} from "@jest/globals";
import "./test-components";
import "../index";


describe('ForEachComponent', () => {
    test('should append on child with the html for each item on data', () => {

        document.body.innerHTML =
            // language=HTML
            `
                <div>
                    <for-each
                            html="<h5 projected>{{@host.data}}</h5>"
                            data="[1,2,3,4]"></for-each>
                </div>

            `;

        const showIfSlotComponent = document.body.querySelectorAll("template-view");
        expect(showIfSlotComponent.length).toBe(4);
        expect(showIfSlotComponent.item(0).innerHTML).toBe(`<h5 projected=""><!--@host.data-->1<!--@host.data--></h5>`);
        expect(showIfSlotComponent.item(1).innerHTML).toBe(`<h5 projected=""><!--@host.data-->2<!--@host.data--></h5>`);
        expect(showIfSlotComponent.item(2).innerHTML).toBe(`<h5 projected=""><!--@host.data-->3<!--@host.data--></h5>`);
        expect(showIfSlotComponent.item(3).innerHTML).toBe(`<h5 projected=""><!--@host.data-->4<!--@host.data--></h5>`);

    });

    test('should pass down value form attribute interpolation to for-each', () => {

        document.body.innerHTML =
            // language=HTML
            `
                <profile-list-components></profile-list-components>
            `;

        const templatesInjected = document.body
            .querySelector("profile-list-components")
            .shadowRoot
            .querySelectorAll("template-view");
        expect(templatesInjected.length).toBe(2);

        expect(templatesInjected.item(0).innerHTML)
            .toBe(`<h5 projected=""><!--@host.data.name-->Miguel<!--@host.data.name--> - <!--@host.data.lastname-->Martinez<!--@host.data.lastname--> </h5>`);
        expect(templatesInjected.item(1).innerHTML)
            .toBe(`<h5 projected=""><!--@host.data.name-->Manuel<!--@host.data.name--> - <!--@host.data.lastname-->Martinez<!--@host.data.lastname--> </h5>`);


    });

});


