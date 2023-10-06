import {Attribute, EventBind, WebComponent} from "@commonweb/core";

export interface FormFieldDescription {
    type: string;
    label: string;
    propertyName: string;
    subDescriptions?: FormFieldDescription[] | null;

    // Can be null
    valuePath?: string;
    labelPath?: string;
    source?: string;


}


@WebComponent({
        selector: 'form-field',
        template: ` <label class="form-field">
                        <span></span>
                        <input />
                    </label>`,
        style: ` :host{
               display:flex;
               width: 100%;
               color: var(--font-primary, #efefef);
                margin: 10px 0;
             }
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
        return input.value;
    }

    get propertyName() {
        return this.getAttribute("property-name");
    }

}

