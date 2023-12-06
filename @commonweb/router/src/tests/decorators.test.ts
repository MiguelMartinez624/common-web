import {describe, expect, test, beforeEach} from '@jest/globals';
import '../index';
import './test-components';
import {WebComponent} from "@commonweb/core";
import {pushUrl} from "../router";

@WebComponent({
    selector: "test-routing-component",
    template: `
        <go-router>
            <go-route   route="/component/test" component="hello-world"></go-route>
            <go-route   route="/component/test/test" component="hello-world-second"></go-route>
            <go-route   route="/component/test/test/{param}/component" component="hello-world-with-param"></go-route>
        </go-router>
    `
})
class RouterTestComponent extends HTMLElement {
}

describe('RouterTest', () => {
    test('should display the route on change when pushed to the location', () => {
        pushUrl("/component/test");

        document.body.innerHTML = `<test-routing-component></test-routing-component>`;
        const component = document.body.querySelector("test-routing-component");
        const router = component.shadowRoot.querySelector("go-router");
        const activeRoute = router.querySelector('go-route[route="/component/test"]');
        expect(activeRoute.querySelector("hello-world")).not.toBe(null);
    });

    test('should show the component with the last location push', () => {
        pushUrl("/component/test");

        document.body.innerHTML = `<test-routing-component></test-routing-component>`;
        const component = document.body.querySelector("test-routing-component");
        const router = component.shadowRoot.querySelector("go-router");
        const activeRoute = router.querySelector('go-route[route="/component/test"]');
        expect(activeRoute.querySelector("hello-world")).not.toBe(null);

        pushUrl("/component/test/test");
        const secondRoute = router.querySelector('go-route[route="/component/test/test"]');
        expect(activeRoute.querySelector("hello-world")).toBe(null);
        expect(secondRoute.querySelector("hello-world-second")).not.toBe(null);

    });


    test('should math {} params on the route as valid when the count of section is equal', () => {
        pushUrl("/component/test/test/343/component");

        document.body.innerHTML = `<test-routing-component></test-routing-component>`;
        const component = document.body.querySelector("test-routing-component");
        const router = component.shadowRoot.querySelector("go-router");
        const activeRoute = router.querySelector('go-route[route="/component/test"]');
        const secondRoute = router.querySelector('go-route[route="/component/test/test"]');
        const thirdRoute = router.querySelector('go-route[route="/component/test/test/{param}/component"]');


        expect(activeRoute.querySelector("hello-world")).toBe(null);
        expect(secondRoute.querySelector("hello-world-second")).toBe(null);
        expect(thirdRoute.querySelector("hello-world-with-param")).not.toBe(null);

    });

});
