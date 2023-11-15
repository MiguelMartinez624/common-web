import {describe, expect, test, beforeEach, jest} from '@jest/globals';
import './test-components';
// Will install components to the register
import './test-components';
import '..';
import {DataFetcherConfiguration} from "../reader.componnet";
// TODO check static creation
//https://stackoverflow.com/questions/35049091/how-to-dynamically-create-static-method-in-javascript

const dataLocalStorageRequestConfiguration: (entity: string) => DataFetcherConfiguration = (entity: string) => {
    return {
        injectTo: ['test-component:data'],
        source: `localstorage://local/data/v3/api/${entity}/search`,
        auto: true,
        fieldType: 'set'
    }
}

describe('DataFetcher', () => {
    beforeEach(() => {
        // fetch.mockClear();
    });

    test('should propagate data to the elements target from the localStorage', async () => {
        const configs = JSON.stringify(dataLocalStorageRequestConfiguration('products'));

        localStorage.setItem("://local/data/v3/api/products/search", JSON.stringify({data: "hello-world"}))
        document.body.innerHTML = `
            <data-fetcher configurations='${configs}'
            ></data-fetcher>
            <test-component></test-component>
        `;

        await new Promise(r => setTimeout(r, 2000));
        const customElement = window.document.querySelector("test-component");
        expect(customElement).toBeDefined();
        console.log("data ", customElement.innerHTML)
        expect(customElement.shadowRoot.querySelector("pre").innerHTML).toBe(JSON.stringify({data: "hello-world"}, null, 2))
    });


});
