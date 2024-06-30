import {Attribute, extractData, WebComponent} from "@commonweb/core";

@WebComponent({
    selector: `multiselect-form-field`,
    template:
    // language=HTML
        `
            <label class="form-field">{{@host:[label]}}
                <button main>
                    <span style="margin-right: 15px;" text>{{@host:[placeholder]}}</span>
                    <span style="right: 10px;position: absolute;cursor: pointer">&#9660;</span>
                </button>
            </label>

            <!-- dropdown options            -->
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
            :host {
                display: flex;
                margin: 10px;
                position: relative;

            }

            .form-field {
                display: flex;
                width: 100%;
                flex-direction: column;
                margin: 10px 0;
            }

            [main] {
                display: flex;
                justify-content: space-between;
                width: 100%;
                background-color: var(--form-field-bg);
                border: var(--form-border, 1px solid);
                border-radius: var(--form-border-radius, 4px);
                border-color: var(--form-border-color, #ccc);
                color: var(--form-text);
                font-size: var(--form-text-size);
                padding: var(--form-input-padding, 12px 20px);
            }

            label {
                color: var(--form-text);
                font-size: var(--form-text-size);
            }

            span[text] {
                overflow: hidden;
                text-overflow: ellipsis;
                text-wrap: nowrap;
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
                margin: 0.4rem 0.5rem;

            }

            .dropdown-menu {
                width: 100%;
                z-index: 99;
                background-color: white;
                box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
                position: absolute;
                top: 80px;
            }

            .hidden {
                display: none
            }

        `
})
export class MultiselectComponent extends HTMLElement {


    @Attribute("placeholder")
    public placeholder: string = "";

    @Attribute("label")
    public label: string = "";
    @Attribute('options')
    public options = [];

    private _options: any[] = [];

    static get observedAttributes(): string[] {
        return ["placeholder", "options-loader", "label", "property-name", "options",];
    }

    connectedCallback() {
        const options = this.shadowRoot.querySelector(".dropdown-menu");
        this.updateOptions(this.options);
        this.addEventListener("mouseleave", () => {
            options.classList.add("hidden");
        });

        this.shadowRoot.querySelector("[main]").addEventListener("click", () => {
            options.classList.remove("hidden");
        });

    }

    public showOptions() {
        const options = this.shadowRoot.querySelector(".dropdown-menu");
        this.showAllOptions();
        options.classList.toggle("hidden");
    }

    private showAllOptions() {
        Array.from(this.shadowRoot.querySelectorAll("[option]"))
            .forEach((o: HTMLElement) => o.parentElement.parentElement.classList.remove("hidden"));
    }

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

    public updateLabel() {

        const labels = Array.from(this.shadowRoot.querySelectorAll("[option]"))
            .filter((c: HTMLInputElement) => c.checked)
            .map((c: HTMLInputElement) => c.parentElement.innerText.trim())
            .join(", ");

        this.shadowRoot.querySelector("[main]").querySelector("span").innerHTML = labels.length > 0 ? labels : this.placeholder;

    }

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
                return {
                    value: extractData(valuePath, item),
                    label: extractData(labelPath, item),
                };
            })
            // Span one html element per option
            .forEach((selectOption: any) => {
                const optionElement = document.createElement("li");

                optionElement.innerHTML = `<label><input option type="checkbox" value="${selectOption.value}">${selectOption.label}</label>`;
                optionElement.addEventListener("click", this.updateLabel.bind(this));
                select.appendChild(optionElement);
            });
    }

    public get value(): any {
        const values = Array.from(this.shadowRoot.querySelectorAll("[option]"))
            .filter((c: HTMLInputElement) => c.checked)
            .map((c: HTMLInputElement) => c.getAttribute("value"))

        return values;

    }

    get propertyName() {
        return this.getAttribute("property-name");
    }
}
