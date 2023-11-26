import {Attribute, extractData, findNodeOnUpTree, subscribeToKeyChange, WebComponent} from "@commonweb/core";

export enum DataFetcherPropsName {
    For = "for",
    Source = "source",
}


export interface DataFetcherConfiguration {
    source: string;
    auto: boolean;
    injectTo: string[];
    resultPath?: string;
    method: 'POST' | 'GET' | 'DELETE' | 'PUT';
    fieldType: 'attribute' | 'set'
}

@WebComponent({
    selector: 'data-fetcher',
    template: ''
})
export class DataFetcher extends HTMLElement {
    private target: string;
    private auto: any;
    private configuration: DataFetcherConfiguration;


    @Attribute('configurations')
    autoLoad(config: DataFetcherConfiguration) {
        this.configuration = config;
        this.onChanges();
    }

    @Attribute('subscribed-key')
    storageKey(key: any) {
        subscribeToKeyChange(key, this.execute.bind(this));
    }


    public onChanges() {
        if (Boolean(this.configuration.auto) === true) {
            // TODO for auto add filters from the outside
            this.data({}).then((result) => {
                const eventSuccess = new CustomEvent(
                    "request-success", {
                        bubbles: true,
                        detail: {data: result}
                    });
                this.dispatchEvent(eventSuccess);
                this.injectData(this.configuration.injectTo, result);
            });
        }
    }

    public execute(filters: any) {
        this.data(filters)
            .then((result) => {
                const eventSuccess = new CustomEvent(
                    "request-success", {
                        bubbles: true,
                        detail: {data: result}
                    });
                this.dispatchEvent(eventSuccess);
                this.injectData(this.target, result);
            })
            .catch((err) => {
                this.dispatchEvent(new CustomEvent("request-failed"));
            });
    }

    private injectData(elementsSelector: any, data: any) {
        // TODO validate eagains array?

        const resultPath = this.configuration.resultPath;
        let result = data;
        if (resultPath) {
            result = extractData(resultPath, data);
        }

        let targetElements = elementsSelector;
        if (typeof elementsSelector === "string") {
            targetElements = JSON.parse(elementsSelector);
        }
        if (!targetElements) {
            return;
        }
        targetElements.forEach((pattern) => {
            const sections = pattern.split(":");
            const element = findNodeOnUpTree(sections[0], this);

            if (element) {
                if (this.configuration.fieldType === "set") {
                    element[sections[1]] = result;
                } else if (this.configuration.fieldType === "attribute") {
                    (element as HTMLElement).setAttribute(sections[1], JSON.stringify(result))
                }

            } else {
                console.error("NO FOUND")
            }

        })
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
        const source = this.configuration.source;
        if (!source) {
            throw new Error("No source set for this reader");
        }
        const sourceType = source.slice(0, source.indexOf(":"));
        const method = this.configuration.method || 'GET';

        // Implement factory pattern
        switch (sourceType) {
            case "https" :
            case "http"  :
                return await this.callRemoteAPI(source, method, filters);
            case "localstorage":
                return this.callLocalStorage(source, method, filters);

            default:
                throw new Error("Invalid source type, available types [http,https,localstorage]");

        }
    }

    private async callRemoteAPI(source: string, method: "POST" | "GET" | "DELETE" | "PUT", filters: any) {

        const result = await fetch(source, {
            method: method,
            body: (filters && method !== 'GET') ? JSON.stringify({...filters, ...this.Payload}) : null,
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!result.ok) {
            throw {error: result.json()}
        }
        return await result.json();

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
        return ["method", "configurations", DataFetcherPropsName.Source, "auto", "result-path", "subscribed-key", "payload"];
    }
}



