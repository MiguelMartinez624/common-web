import {describe, expect, test, beforeEach, jest} from '@jest/globals';
import './test-components';
// Will install components to the register
import '..';
import {DataFetcher, DataFetcherConfiguration} from "../reader.componnet";
// TODO check static creation
//https://stackoverflow.com/questions/35049091/how-to-dynamically-create-static-method-in-javascript

const dataLocalStorageRequestConfiguration: (entity: string, auto: boolean) => DataFetcherConfiguration = (entity: string, auto: boolean) => {
    return {
        injectTo: ['test-component:data'],
        source: `localstorage://local/data/v3/api/products/search`,
        auto: auto,
        method: "GET",
        fieldType: 'set'
    }
}

describe('DataFetcher', () => {
    beforeEach(() => {
        // fetch.mockClear();
    });

    test('should propagate data to the elements target from the localStorage', async () => {
        const configs = JSON.stringify(dataLocalStorageRequestConfiguration('products',true));

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


    test('should emit loading when any data fetching starts', async () => {
        const configs = JSON.stringify(dataLocalStorageRequestConfiguration('products', false));

        localStorage.setItem("://local/data/v3/api/products/search", JSON.stringify({data: "hello-world"}))
        document.body.innerHTML = `
            <data-fetcher configurations='${configs}'
            ></data-fetcher>
            <test-component></test-component>
        `;
        await new Promise(r => setTimeout(r, 2000));

        const fetcher = window.document.querySelector("data-fetcher") as DataFetcher;
        let loadedCalled = false;

        fetcher.addEventListener("loading", () => {
            loadedCalled = true;
        })
        fetcher.execute({});


        expect(loadedCalled).toBeTruthy()
    });

});
