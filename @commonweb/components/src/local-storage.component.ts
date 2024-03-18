import {Attribute, WebComponent} from "@commonweb/core";

@WebComponent({
    selector: 'local-storage-value',
    template: ''
})
export class LocalStorageComponent extends HTMLElement {

    @Attribute("key")
    public key: string;

    public get value(): any {
        return callLocalStorage(this.key, "GET", null);
    }

    public setValue(value: any): void {
        callLocalStorage(this.key, "POST", value);
    }

    static get observedAttributes(): string[] {
        return ["key"];


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
