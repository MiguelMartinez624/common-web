import {WebComponent} from "@commonweb/core";
import "@commonweb/data";
import {DataFetcher, DataFetcherConfiguration} from "@commonweb/data";

@WebComponent({
    selector: "credentials-strategy",
    template: "<data-fetcher><data-fetcher>",
})
export class CredentialsStrategy extends HTMLElement {
    connectedCallback() {
        this.setAttribute("auth-strategy", "credentials")
    }

    public execute(username: string, password: string): void {
        const fetcher = this.shadowRoot.querySelector("data-fetcher") as DataFetcher;
        const configuration: DataFetcherConfiguration = {
            method: "POST",
            source: this.getAttribute("endpoint"),
            injectTo: [],
            auto: false,
            fieldType: "attribute"
        }

        fetcher.setAttribute("configurations", JSON.stringify(configuration));
        fetcher.execute([username, password]);
    }
}

@WebComponent({
    selector: "cognito-strategy",
    template: "<data-fetcher><data-fetcher>",
})
export class CognitoStrategy  extends HTMLElement {
    connectedCallback() {
        this.setAttribute("auth-strategy", "cognito")
        const script = document.createElement("script");
        this.shadowRoot.appendChild(script);

    }

    public execute(username: string, password: string): void {
        const fetcher = this.shadowRoot.querySelector("data-fetcher") as DataFetcher;
        const configuration: DataFetcherConfiguration = {
            method: "POST",
            source: this.getAttribute("endpoint"),
            injectTo: [],
            auto: false,
            fieldType: "attribute"
        }

        fetcher.setAttribute("configurations", JSON.stringify(configuration));
        fetcher.execute([username, password]);
    }
}
