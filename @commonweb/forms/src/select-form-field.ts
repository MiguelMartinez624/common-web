import {Attribute, WebComponent} from "@commonweb/core";

@WebComponent({
    selector: `select-form-field`,
    //language=HTML
    template: `

        <label class="form-field">
            <span>{{@host:[label]}}</span>
            <select name="select-input">

            </select>
        </label>
    `,

    // language=CSS
    style: `
        :host {
            display: flex;
            margin: 10px;
        }

        .form-field {
            display: flex;
            width: 100%;
            flex-direction: column;
            margin: 10px 0;
            background-color: var(--form-field-bg);
            border: var(--form-border, 1px solid);
            border-radius: var(--form-border-radius, 4px);
            border-color: var(--form-border-color, #ccc);
            padding-right: 10px;
        }

        select {
            background: none;
            font-size: var(--form-text-size);
            color: var(--form-text);
            border: none;
            padding: var(--form-input-padding, 12px 20px);
        }

        label {
            gap: 4px;
            color: var(--form-text);
            font-size: var(--form-text-size);
        }
    `
})
export class SelectFormField extends HTMLElement {

    @Attribute("placeholder")
    public placeholder: string = "";

    @Attribute("label")
    public label: string = "";

    @Attribute('options')
    public options = [];

    public reset() {
        this.shadowRoot.querySelector("select").value = ""
    }

    public value() {
        const value = this.shadowRoot.querySelector("select").value;
        return value;
    }

    connectedCallback() {
        const options = this.querySelectorAll("option") || this.shadowRoot.querySelectorAll("option");
        const selectElement = this.shadowRoot.querySelector("select");
        options.forEach(op => {
            selectElement.appendChild(op.cloneNode(true));
        })
    }
}
