import {Attribute, EventBind, extractData, WebComponent} from "@commonweb/core";
import {DataFetcherConfiguration} from "@commonweb/forms";
import {SelectOption} from "@commonweb/forms/src";

@WebComponent({
    selector: `multi-select`,
    template:
    // language=HTML
        `


            <button main><span text>{{@host.placeholder}}</span>
                <pp-icon icon="expand_more"></pp-icon>
            </button>
          
                <div class="dropdown-menu hidden">
                     <form-field
                            label="Nombre"
                            placeholder="Ej. Pavlova"
                            search type="text">
                    </form-field>
                    <ul class="options-list" aria-labelledby="multiSelectDropdown">
                    </ul>
              
                </div>
           

        `,
    style:
    // language=CSS
        `
            span[text]{
                overflow: hidden;
                text-overflow: ellipsis;
                text-wrap: nowrap;
            }
            :host {
                width: 200px;
                padding: 1px;
                position: relative;
            }

            [main] {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 9px;
                margin: 0px 0;
                border-radius: var(--btn-radius, 5px);
                cursor: pointer;
                background: none;
                color: var(--btn-primary-bg);
                border: solid 1px var(--btn-primary-bg);
            }

            ul {
                list-style: none;
                max-height: 230px;
                overflow-y: auto;
                padding: 0;

            }

            li:hover {
                background-color: rgba(15, 143, 253, 0.07);
            }

            li {
                margin: 0.4rem 0;

            }

            .dropdown-menu {
                z-index: 99;
                background-color: var(--bg-primary);
                padding: 1rem;
                width: calc(100% - 2rem);
                box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
                position: absolute;
            }

            .hidden {
                display: none
            }

        `
})
export class MultiselectComponent extends HTMLElement {


    @Attribute("placeholder")
    public placeholder: string;

    private _options: any[] = [];

    static get observedAttributes(): string[] {
        return ["placeholder", "options-loader"];
    }

    connectedCallback() {
        this.addEventListener("mouseleave",()=>{
            const options = this.shadowRoot.querySelector(".dropdown-menu");

            options.classList.add("hidden");
        })
    }

    @EventBind("button:click")
    public showOptions() {

        const options = this.shadowRoot.querySelector(".dropdown-menu");
        this.showAllOptions();
        options.classList.toggle("hidden");
    }

    private showAllOptions() {
        Array.from(this.shadowRoot.querySelectorAll("[option]"))
            .forEach((o: HTMLElement) => o.parentElement.parentElement.classList.remove("hidden"));
    }

    @EventBind("form-field[search]:input")
    public updateList({target}) {
        if (target.value.length === 0) {
            this.showAllOptions();
            return;
        }

        Array.from(this.shadowRoot.querySelectorAll("[option]"))
            .forEach((n: HTMLInputElement) => {
                if (!n.labels[0].innerText.trim().toLowerCase().startsWith(target.value.toLowerCase())) {
                    n.parentElement.parentElement.classList.add("hidden");
                } else {
                    n.parentElement.parentElement.classList.remove("hidden");
                }

            });
    }

    @Attribute('options-loader')
    public optionsLoader(config: DataFetcherConfiguration) {
        console.log({config})
        callRemoteAPI(config.source, config.method, config.filters)
            .then((result) => {
                if (config.resultPath) {
                    const options = extractData(config.resultPath, result);
                    this.updateOptions([...this._options, ...options]);
                }
            })
            .catch(console.error)
    }

    @EventBind("input[option]:change")
    public updateLabel() {

        const labels = Array.from(this.shadowRoot.querySelectorAll("[option]"))
            .filter((c: HTMLInputElement) => c.checked)
            .map((c: HTMLInputElement) => c.parentElement.innerText.trim())
            .join(", ");

        this.shadowRoot.querySelector("[main]").querySelector("span").innerHTML = labels.length > 0 ? labels : this.placeholder;

    }

    @Attribute('options')
    public updateOptions(options: any[]) {
        if (!options || !Array.isArray(options)) {
            return;
        }
        this._options = options;
        // Clear the options
        const select = this.shadowRoot.querySelector("ul");
        select.innerHTML = "";

        const labelPath = this.getAttribute("label-path");
        const valuePath = this.getAttribute("value-path");

        // Get data from the options
        options
            .map((item: any) => {
                // TODO validate and add ignore policis as a param
                return {
                    value: extractData(valuePath, item),
                    label: extractData(labelPath, item),
                } as SelectOption;
            })
            // Span one html element per option
            .forEach((selectOption: SelectOption) => {
                const optionElement = document.createElement("li");

                optionElement.innerHTML = `<label><input option type="checkbox" value="${selectOption.value}">${selectOption.label}</label>`;

                optionElement.addEventListener("click", this.updateLabel.bind(this));


                select.appendChild(optionElement);
            });
    }

}


async function callRemoteAPI(source: string, method: "POST" | "GET" | "DELETE" | "PUT", filters: any) {
    console.log(source)
    const result = await fetch(source, {
        method: method,
        body: (filters && method !== 'GET') ? JSON.stringify({...filters}) : null,
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!result.ok) {
        throw {error: await result.json()}
    }
    return await result.json();

}