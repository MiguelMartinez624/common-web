import {Attribute, WebComponent} from "@commonweb/core";
import {callLocalStorage} from "./local-storage.component";

@WebComponent({
    selector: 'api-call',
    template: ''
})
export class ApiCallComponent extends HTMLElement {
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

        const headers = [...this.querySelectorAll("http-header")]
            .map((c: HTTPHeaderComponent) => {
                const value = c.getAttribute("value");
                let headerValue = null;
                if (value.startsWith("@localstorage")) {
                    const key = value.replace("@localstorage:", "");
                    headerValue = callLocalStorage(key, "GET", null);
                } else {
                    headerValue = value;
                }

                return {key: c.getAttribute("key"), value: headerValue}
            });


        switch (sourceType) {
            case "https" :
            case "http"  :
                return await callRemoteAPI(this._source, method, filters, this.Payload, headers);
            default:
                throw new Error("Invalid source type, available types [http,https,localstorage]");

        }
    }


    static get observedAttributes() {
        return ["method", "src", "auto", "result-path", "subscribed-key", "payload"];
    }
}


@WebComponent({
    selector: 'http-header',
    template: ''
})
export class HTTPHeaderComponent extends HTMLElement {

    @Attribute("string")
    public key: string;

    @Attribute("value")
    public value: string;

    static get observedAttributes() {
        return ["key", "value"];
    }
}


export async function callRemoteAPI(source: string, method: "POST" | "GET" | "DELETE" | "PUT", filters: any, payload?: any, headers?: any) {
    const headersMap = new Headers({"Content-type": "application/json"});
    if (headers) {
        headers.forEach((h) => headersMap.append(h.key, h.value));
    }
    const result = await fetch(source, {
        method: method,
        body: (filters && method !== 'GET') ? JSON.stringify({...filters, ...payload}) : null,
        headers: headersMap
    });
    const contentType = result.headers.get("Content-Type")

    const resultBody = contentType.startsWith("application/json") ? await result.json() : await result.text();

    if (!result.ok) {
        throw {error: resultBody}
    }

    return resultBody


}
