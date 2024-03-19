import {Attribute, extractData, WebComponent} from "@commonweb/core";

@WebComponent({
    selector: 'local-storage-value',
    template: ''
})
export class LocalStorageComponent extends HTMLElement {

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
    }

    static get observedAttributes(): string[] {
        return ["key","property"];


    }

}


export function callLocalStorage(key: string, method: "POST" | "GET" | "DELETE" | "PUT", data: any) {
    switch (method) {
        case "POST":
            localStorage.setItem(key, JSON.stringify(data));
            break;
        case "GET":
            const value = localStorage.getItem(key);
            if (value) {
                return JSON.parse(value)
            }
            return null;
        case "DELETE":
            localStorage.removeItem(key);
            return;
        case "PUT":
            return;

    }
    return;
}
