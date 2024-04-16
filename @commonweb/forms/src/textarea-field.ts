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

        textarea {
            background-color: var(--form-field-bg);
            border: var(--form-border, 1px solid);
            border-radius: var(--form-border-radius, 4px);
            border-color: var(--form-border-color, #ccc);
            color: var(--form-text);
            font-size: var(--form-text-size);

            padding: var(--form-input-padding, 12px 20px);
        }

        label {
            gap: 4px;
            color: var(--form-text);
            font-size: var(--form-text-size);
        }
    `,
    selector: 'textarea-field',
    // language=HTML
    template: `

        <label class="form-field" for="">
            <span>{{@host:[label]}}</span>
            <textarea
                    rows="{{@host:[rows]}}"
                    placeholder="{{@host:[placeholder]}}"></textarea>
        </label>
    `,
})
export class TextareaField extends FrameworkComponent {
    @Attribute("placeholder")
    public placeholder: string = "";

    @Attribute("rows")
    public rows: number = 3;

    @Attribute("label")
    public label: string = "";


    @Attribute("property")
    public property: string = "";

    public reset() {
        (this.shadowRoot.querySelector("textarea") as HTMLTextAreaElement).value = ""
    }

    public value() {
        const value = (this.shadowRoot.querySelector("textarea") as HTMLTextAreaElement).value;
        return value;
    }

    public setValue(val: any) {
        (this.shadowRoot.querySelector("textarea") as HTMLTextAreaElement).value = val;

    }

    connectedCallback() {
        function reverseDecimals(value) {
            const parts = value.split('.');
            return parts[1] + '.' + parts[0];
        }


    }


    static get observedAttributes(): string[] {
        return ["property", "format", "label", "placeholder", "rows"];
    }

}
