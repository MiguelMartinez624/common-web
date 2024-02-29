import {WebComponent} from "../web_components";
import {Attribute} from "../attributes";

export enum DataFetcherPropsName {
    Source = "source",
}

// Meter dentro los estados de llamada y eso
@WebComponent({
    selector: 'api-call',
    template: '<slot></slot>'
})
export class ApiCallComponent extends HTMLElement {
    private _type: string;
    private _source: string = "";
    private _method: 'POST' | 'GET' | 'DELETE' | 'PUT';

    @Attribute("auto")
    public auto: boolean = false;

    @Attribute("method")
    public set method(method: 'POST' | 'GET' | 'DELETE' | 'PUT') {
        this._method = method;
        if (this.auto) {
            this.execute({})
        }
    }

    @Attribute("src")
    public set src(source: string) {

        this._source = source;
        if (this.auto) {
            this.execute({})
        }
    }

    public execute(filters: any) {
        if (!this._source || !this._method) {
            return;
        }
        this.data(filters)
            .then((result) => {
                const eventSuccess = new CustomEvent(
                    "request-success", {
                        bubbles: true,
                        detail: {data: result}
                    });
                this.dispatchEvent(eventSuccess);
            })
            .catch((err) => {
                this.dispatchEvent(new CustomEvent("request-failed"));
            });
    }


    public get Payload(): any {
        const payload = this.getAttribute("payload")
        if (!payload) {
            return {};
        }
        return JSON.parse(payload);
    }

    async data(filters: any): Promise<any> {
        this.dispatchEvent(new CustomEvent("loading"));
        if (!this._source) {
            throw new Error("No source set for this reader");
        }
        const sourceType = this._source.slice(0, this._source.indexOf(":"));
        const method = this._method || 'GET';

        // Implement factory pattern
        switch (sourceType) {
            case "https" :
            case "http"  :
                return await callRemoteAPI(this._source, method, filters, this.Payload);
            case "localstorage":
                return this.callLocalStorage(this._source, method, filters);

            default:
                throw new Error("Invalid source type, available types [http,https,localstorage]");

        }
    }


    private callLocalStorage(source: string, method: "POST" | "GET" | "DELETE" | "PUT", filters: any) {
        const storageKey = source.slice(source.indexOf(":"));
        switch (method) {
            case "POST":
                localStorage.setItem(storageKey, JSON.parse(filters));
                break;
            case "GET":
                const value = localStorage.getItem(storageKey);
                if (value) {
                    return JSON.parse(value)
                }
                throw "not found on storage";
            case "DELETE":
                localStorage.removeItem(storageKey);
                return;
            case "PUT":
                return;

        }
        return;
    }

    static get observedAttributes() {
        return ["method", "src", "auto", "result-path", "subscribed-key", "payload"];
    }
}


export async function callRemoteAPI(source: string, method: "POST" | "GET" | "DELETE" | "PUT", filters: any, payload?: any) {
    const result = await fetch(source, {
        method: method,
        body: (filters && method !== 'GET') ? JSON.stringify({...filters, ...payload}) : null,
        headers: {
            "Content-Type": "application/json",
        }
    });
    const contentType = result.headers.get("Content-Type")

    const resultBody = contentType === "application/json" ? await result.json() : await result.text();

    if (!result.ok) {
        throw {error: resultBody}
    }

    return resultBody


}
