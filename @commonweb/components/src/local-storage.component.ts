import {Attribute, extractData, WebComponent} from "@commonweb/core";

@WebComponent({
    selector: 'local-storage-value',
    template: ''
})
export class LocalStorageComponent extends HTMLElement {

    @Attribute("property-matcher")
    public propertyMatcher: string;

    @Attribute("key")
    public key: string;


    @Attribute("property")
    public property: string;

    public get value(): any {
        this.property = this.getAttribute("property");
        const object = callLocalStorage(this.key, "GET", null);
        if (!this.property) {
            return object;
        }

        return extractData(this.property, object);
    }

    public setValue(value: any): void {
        callLocalStorage(this.key, "POST", value);
        this.dispatchEvent(new CustomEvent("new-value", {detail: value}));
    }

    public append(value: any): void {
        callLocalStorage(this.key, "APPEND", value);
        this.dispatchEvent(new CustomEvent("appended-value", {detail: value}));
    }

    public removeKey(): void {
        const removed = callLocalStorage(this.key, "DELETE", null);
        this.dispatchEvent(new CustomEvent("removed-value", {detail: removed}));
    }

    public updateValue(value: any): void {
        const identifier = this.getAttribute("item-key");
        const toCompare = extractData(identifier, value);
        callLocalStorage(this.key, "PUT", value, (ele) => {
            const onEle = extractData(identifier, ele);
            return onEle === toCompare;
        });
        this.dispatchEvent(new CustomEvent("updated-value", {detail: value}));

    }

    public removeItem(identifier: any): void {
        console.log({identifier})
        callLocalStorage(this.key,
            "DELETE-ITEM",
            identifier,
            (ele) => ele[this.getAttribute("property-matcher")] === identifier);
        this.dispatchEvent(new CustomEvent("item-removed", {detail: identifier}));

    }

    static get observedAttributes(): string[] {
        return ["key", "property", "property-matcher"];


    }

}


export function callLocalStorage(
    key: string,
    method: "POST" | "GET" | "DELETE" | "PUT" | "APPEND" | "DELETE-ITEM",
    data: any,
    findIndexCallback?: (item: any) => boolean
) {
    switch (method) {
        case "POST":
            localStorage.setItem(key, JSON.stringify(data));
            break;
        case "GET":
            const value = localStorage.getItem(key);
            if (value) {
                return JSON.parse(value);
            }
            return null;
        case "DELETE":
            const removed = callLocalStorage(key, "GET", null)
            localStorage.removeItem(key);
            return removed;
        case "PUT":
            // Implement PUT logic for updating existing data
            const existingData = localStorage.getItem(key);
            if (!existingData) {
                // Key doesn't exist, cannot perform PUT
                return;
            }

            // Parse existing data and merge with incoming data
            let parsedData;
            try {
                parsedData = JSON.parse(existingData);
            } catch (error) {
                console.error("Error parsing existing data in localStorage:", error);
                return;
            }
            if (Array.isArray(parsedData)) {
                replaceAndSave(key, parsedData, data, findIndexCallback)
                break;
            }

            const updatedData = {...parsedData, ...data}; // Merge objects
            localStorage.setItem(key, JSON.stringify(updatedData));
            break;
        case "APPEND":
            pushLocalStorage(key, data);
            break;
        case "DELETE-ITEM":
            const array = callLocalStorage(key, "GET", null);
            if (!array || !Array.isArray(array)) {
                return null;
            }
            const index = array.findIndex(findIndexCallback);
            (array as any[]).splice(index,1);
            callLocalStorage(key, "POST", array);

            break;
    }
    return;
}

function replaceAndSave(key: string, array: any[], data: any, findIndexCallback?: (item: any) => boolean) {
    if (!Array.isArray(array)) {
        console.error(`Value stored in key "${key}" is not an array`);
        return;
    }

    // Find the index of the element to replace
    const indexToReplace = findIndexCallback ? array.findIndex(findIndexCallback) : -1;

    if (indexToReplace === -1) {
        console.error("Element to replace not found in array");
        return;
    }

    // Replace the element at the specified index
    array[indexToReplace] = data;

    localStorage.setItem(key, JSON.stringify(array));
}

function pushLocalStorage(key: string, data: any) {
    const existingArray = localStorage.getItem(key);
    let parsedArray: any[] = [];
    if (existingArray) {
        try {
            parsedArray = JSON.parse(existingArray);
        } catch (error) {
            console.error("Error parsing existing data in localStorage:", error);
            return;
        }
    }
    parsedArray.push(data);
    localStorage.setItem(key, JSON.stringify(parsedArray));
}