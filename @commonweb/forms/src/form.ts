import {Attribute, FrameworkComponent, WebComponent} from "@commonweb/core";
import {FormField} from "./form-field";
import {MultiselectComponent} from "./multiselect-form-field";

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
export class FormGroup extends FrameworkComponent {
    public submit() {
        const selects = this.querySelectorAll("form-select")
        const value = {};
        const formFields = this.querySelectorAll("form-field") as any as FormField[]
        formFields.forEach((input) => value[input.getAttribute("property")] = input.value());

        const multiselectFormFields = this.querySelectorAll("multiselect-form-field") as any as MultiselectComponent[]
        multiselectFormFields.forEach((input) => value[input.getAttribute("property")] = input.value);

        const event = new CustomEvent("submit", {detail: {data: value}});
        this.dispatchEvent(event)
    }

    public reset() {
        const inputs = this.querySelectorAll("form-field") as any as FormField[]
        inputs.forEach((input) => input.reset());
    }

    @Attribute("property")
    public property: string = "";

    static get observedAttributes(): string[] {
        return ["property", "format", "label", "placeholder"];
    }

}
