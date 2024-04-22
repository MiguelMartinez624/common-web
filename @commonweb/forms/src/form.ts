import {Attribute, WebComponent} from "@commonweb/core";
import {FormField} from "./form-field";
import {MultiselectComponent} from "./multiselect-form-field";
import {TextareaField} from "./textarea-field";
import {SelectFormField} from "./select-form-field";

@WebComponent({
    //language=css
    style: `
        :host {
            display: block;
        }`,
    selector: 'form-group',
    // language=HTML
    template: `
        <slot></slot>  `,
})
export class FormGroup extends HTMLElement {
    public submit() {
        const selects = this.querySelectorAll("form-select")
        const value = {};
        const formFields = this.querySelectorAll("form-field") as any as FormField[]
        formFields.forEach((input) => value[input.getAttribute("property")] = input.value());

        const selectFormFields = this.querySelectorAll("select-form-field") as any as SelectFormField[]
        selectFormFields.forEach((input) => value[input.getAttribute("property")] = input.value());

        const textareaFields = this.querySelectorAll("textarea-field") as any as TextareaField[]
        textareaFields.forEach((input) => value[input.getAttribute("property")] = input.value());


        const multiselectFormFields = this.querySelectorAll("multiselect-form-field") as any as MultiselectComponent[]
        multiselectFormFields.forEach((input) => value[input.getAttribute("property")] = input.value);

        const event = new CustomEvent("submit", {detail: {data: value}});
        this.dispatchEvent(event)
    }

    public reset() {
        const inputs = this.querySelectorAll("form-field") as any as FormField[]
        inputs.forEach((input) => input.reset());

        const textareaFields = this.querySelectorAll("textarea-field") as any as TextareaField[]
        textareaFields.forEach((input) => input.reset());

    }

    public set value(obj: Record<string, any>) {
        for (const clave of obj) {
            console.log(`Clave: ${clave}`);
            console.log(`Valor: ${objetoJSON[clave]}`);
        }
    }

    @Attribute("property")
    public property: string = "";

    static get observedAttributes(): string[] {
        return ["property", "format", "label", "placeholder"];
    }

}
