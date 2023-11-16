import {describe, expect, test, beforeEach} from '@jest/globals';
import {changeStorageValue} from "..";

// Will install components to the register
import './test-components';

// TODO check static creation
//https://stackoverflow.com/questions/35049091/how-to-dynamically-create-static-method-in-javascript

describe('@WebComponent', () => {
    test('should register the element on the customElements registry with the tag name on the config', () => {
        document.body.innerHTML = `<hello-world></hello-world>`;
        const customElement = window.customElements.get("hello-world");
        expect(customElement).toBeDefined();
    });

    test('should append the template to the element\'s shadowRoot.', () => {
        document.body.innerHTML = `<hello-world></hello-world>`;
        const component = document.body.querySelector("hello-world");
        expect(component.shadowRoot.innerHTML).toBe("<h4>Hello World!</h4>");
    });

});


describe('@Attribute', () => {
    test('attributes should be available and call the corresponding handler attached with @Attribute decorator.', () => {
        document.body.innerHTML = `<hello-world-attr name="Dev!"></hello-world-attr>`;
        const component = document.body.querySelector("hello-world-attr");
        expect(component.shadowRoot.innerHTML).toBe("<h4>Hello World! Dev!</h4>");
    });


    test('attributes handlers should react to common attributes changes methods like HTMLElement.setAttribute.', () => {
        document.body.innerHTML = `<hello-world-attr></hello-world-attr>`;
        const component = document.body.querySelector("hello-world-attr");
        component.setAttribute("name", "Senior Dev!")
        expect(component.shadowRoot.innerHTML).toBe("<h4>Hello World! Senior Dev!</h4>");
    });
});


describe('@EventBind', () => {
    test('should attach event listeners to the corresponding event pattern.', () => {
        document.body.innerHTML = `<hello-world-event name="Dev!"></hello-world-event>`;
        const component = document.body.querySelector("hello-world-event");

        const btn = component.shadowRoot.querySelector("button");
        expect(btn).toBeDefined();
        btn.click();
        const currentH4Content = component.shadowRoot.querySelector("h4").innerHTML;
        expect(currentH4Content).toBe("Hello World! Just Got Clicked!");
    });

});
describe('@EventBindAll', () => {
    test('should attach event listeners to the corresponding event pattern.', () => {
        document.body.innerHTML = `<orders-page name="Dev!"></orders-page>`;

    });

});

describe('@FromStorage', () => {
    beforeEach(() => {
        // restart the storage
        localStorage.clear();
    })

    test('should listen and call handler to storage key changes.', () => {
        document.body.innerHTML = `<hello-world-storage></hello-world-storage>`;
        const component = document.body.querySelector("hello-world-storage");


        changeStorageValue("hello-world-key", "World!");
        const currentH4Content = component.shadowRoot.querySelector("h4").innerHTML;
        expect(currentH4Content).toBe("Hello World!");
    });

    test('should ONLY listen to the given key.', () => {
        document.body.innerHTML = `<hello-world-storage></hello-world-storage>`;
        const component = document.body.querySelector("hello-world-storage");
        changeStorageValue("hello-world-key-no-subscribed", "World!");
        const currentH4Content = component.shadowRoot.querySelector("h4").innerHTML;
        expect(currentH4Content).toBe("Hello");
    });


    test('should get the initial value on the storage on component init.', () => {
        // change the value first
        changeStorageValue("hello-world-key", "World!");

        // insert the element after
        document.body.innerHTML = `<hello-world-storage></hello-world-storage>`;
        const component = document.body.querySelector("hello-world-storage");
        const currentH4Content = component.shadowRoot.querySelector("h4").innerHTML;
        expect(currentH4Content).toBe("Hello World!");
    });

})
