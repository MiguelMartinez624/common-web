import {Attribute, subscribeToKeyChange, WebComponent, extractData} from "@commonweb/core";
import {findNodeOnUpTree} from "@commonweb/core";

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
                this.injectData(this.configuration.injectTo, result);
            });
        }
    }

    public execute(filters: any) {
        this.data(filters).then((result) => {
            this.injectData(this.target, result);
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

    async data(filters: any): Promise<any> {
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

                return fetch(source, {
                    method: method,
                    body: (filters && method !== 'GET') ? JSON.stringify(filters) : null,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }).then((res) => res.json());

            case "localstorage":
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
                        return null;
                    case "DELETE":
                        localStorage.removeItem(storageKey);
                        break;
                    case "PUT":
                        break;

                }
                break;

            default:
                throw new Error("Invalid source type, available types [http,https,localstorage]");

        }
    }

    static get observedAttributes() {
        return ["method", "configurations", DataFetcherPropsName.Source, "auto", "result-path", "subscribed-key"];
    }
}



