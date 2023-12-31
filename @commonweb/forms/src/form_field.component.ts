import {Attribute, EventBind, WebComponent} from "@commonweb/core";

export interface FormFieldDescription {

    type: string;
    label: string;
    propertyName: string;
    subDescriptions?: FormFieldDescription[] | null;
    defaultValue?: any;
    // Can be null
    width?: string;

    options?: any[];
    valuePath?: string;
    labelPath?: string;
    source?: string;
    optionsLoader?: DataFetcherConfiguration;
}

export interface DataFetcherConfiguration {
    source: string;
    resultPath?: string;
    filters: any;
    method: 'POST' | 'GET' | 'DELETE' | 'PUT';
}

@WebComponent({
        selector: 'form-field',
        template: ` <label class="form-field">
                        <span></span>
                        <input />
                    </label>`,
        style: `
            :host{display:flex;flex-direction:column;gap:10px;color: var( --font-primary, #efefef);}
             
            input{
                  color: var( --font-primary, #efefef);
                  padding: 12px 20px;
                  margin: 10px 0;
                  display: inline-block;
                  border: 1px solid #ccc;
                  border-radius: var(--btn-radius,4px);
                  box-sizing: border-box;
                  background-color: var(--bg-primary,gray);
            }
            
            .form-field {
              display:flex;
              width: 100%;
              flex-direction:column;
            }
        `,
    }
)
export class FormField extends HTMLElement {

    private handler: (value: string) => void | null;

    static get observedAttributes() {
        return ["label", "placeholder", "type", "property-name"]
    }

    @Attribute("label")
    public changeLabel(label: string) {
        const labelSpan = this.shadowRoot.querySelector("span");
        labelSpan.innerHTML = label;
    }

    @Attribute("placeholder")
    public changePlaceholder(label: string) {
        const labelSpan = this.shadowRoot.querySelector("input");
        labelSpan.setAttribute("placeholder", label)
    }

    @Attribute("type")
    public changeType(label: string) {
        const labelSpan = this.shadowRoot.querySelector("input");
        labelSpan.setAttribute("type", label)
    }


    set onInput(handler: (value: string) => void) {
        this.handler = handler;
    }

    clear() {
        const input = this.shadowRoot.querySelector("input");
        input.value = "";
    }

    @EventBind("input:input")
    public handleInput() {
        if (this.handler) {
            this.handler(this.value as string);
        }
    }


    get value() {
        const input = this.shadowRoot.querySelector("input");
        if (this.getAttribute("type") === "date") {
            return new Date(input.value).toISOString();
        }
        if (this.getAttribute("type") === "number") {
            return Number(input.value);
        }
        if (this.getAttribute("type") === "checkbox") {
            return input.checked;
        }
        return input.value;
    }

    get propertyName() {
        return this.getAttribute("property-name");
    }

    setValue(value: any) {
        const input = this.shadowRoot.querySelector("input");
        input.value = value;
    }
}

