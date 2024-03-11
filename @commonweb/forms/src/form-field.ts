import {Attribute, FrameworkComponent, WebComponent} from "@commonweb/core";

@WebComponent({
    //language=css
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
        }

        input {
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
    `,
    selector: 'form-field',
    // language=HTML
    template: `

        <label class="form-field" for="">
            <span>{{@host:[label]}}</span>
            <input
                    placeholder="{{@host:[placeholder]}}"
                    type="{{@host:[format]}}">
        </label>
    `,
})
export class FormField extends FrameworkComponent {
    @Attribute("placeholder")
    public placeholder: string = "";

    @Attribute("label")
    public label: string = "";

    @Attribute("format")
    public format: string = "";

    @Attribute("property")
    public property: string = "";

    public reset() {
        this.shadowRoot.querySelector("input").value = ""
    }

    public value() {
        const value = this.shadowRoot.querySelector("input").value;
        if (this.format = "date") {
            return new Date(value);
        }

        return value;
    }


    static get observedAttributes(): string[] {
        return ["property", "format", "label", "placeholder"];
    }

}
