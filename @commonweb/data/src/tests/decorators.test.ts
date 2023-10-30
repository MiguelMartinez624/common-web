import {describe, expect, test, beforeEach, jest} from '@jest/globals';
import './test-components';
// Will install components to the register
import './test-components';
import '..';
import {DataFetcherConfiguration} from "../reader.componnet";
// TODO check static creation
//https://stackoverflow.com/questions/35049091/how-to-dynamically-create-static-method-in-javascript

const dataRequestConfiguration: (entity: string) => DataFetcherConfiguration = (entity: string) => {
    return {
        injectTo: ['go-table:data'],
        source: `${window['__HOST']}/v3/api/${entity}/search`,
        auto: true,
        fieldType: 'set'
    }
}

describe('DataFetcher', () => {
    beforeEach(() => {
        // fetch.mockClear();
    });

    test('should propagate data to the elements target', async () => {
        document.body.innerHTML = `
            <data-fetcher configurations="${JSON.stringify(dataRequestConfiguration('products'))}"
            ></data-fetcher>
            <test-component></test-component>
        `;

        await new Promise(r => setTimeout(r, 2000));
        const customElement = window.document.querySelector("test-component");
        expect(customElement).toBeDefined();
        console.log("data ", customElement.innerHTML)
        expect(customElement.innerHTML).toBe("No Data")
    });


});
