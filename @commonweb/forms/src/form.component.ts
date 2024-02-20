import {Attribute, EventBind, extractData, WebComponent} from "@commonweb/core";
import {FormField, FormFieldDescription} from "./form_field.component";
import {SelectInput} from "./select.component";
import {MultiselectComponent} from "./multiselect.component";


@WebComponent({
    selector: 'entity-form',
    template: `<div class="form"></div>`,
    style: `:host{
                color: var(--font-color, black);
                width:100%;
            }
            
            .form {   
              display:flex;
              flex-wrap:wrap;
              gap:10px;
            }
       
            .sub_form {
                padding: 1rem;
                border:1px solid gray;
             
            }
         
            button[submit-btn] {
              width: 100%;
              background-color: #4CAF50;
              color: white;
              padding: 14px 20px;
              margin: 8px 0;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }`,
})
export class EntityForm extends HTMLElement {
    mainElement;
    private _configurations: FormFieldDescription[];

    public setValue(data: any) {
        // should no return should call metod reset
        const inputs: NodeListOf<FormField> = this.shadowRoot.querySelectorAll("form-field");
        inputs.forEach((input, i) => input.setValue(extractData(input.propertyName, data)));

        // for listing
        //TODO change class name
        const subForms: NodeListOf<EntityForm> = this.shadowRoot.querySelectorAll("entity-form.sub_form");
        subForms.forEach((subForm) => {
            if (!data[subForm.getAttribute("property")]) {
                return;
            }

            subForm.setValue(extractData(subForm.getAttribute("property"), data));
        });

    }

    static get observedAttributes() {
        return ["configurations", "submit-label"];
    }

    reset(): void {
        this.shadowRoot.querySelectorAll("entity-form.sub_form")
            .forEach((form: EntityForm) => form.reset());

        this.shadowRoot.querySelectorAll("form-field")
            .forEach((input: FormField) => input.clear());
    }

    value() {
        // get the form values
        const values = {}

        this._configurations.filter(c => c.type === "silent")
            .forEach(c => values[c.propertyName] = c.defaultValue)

        // should no return should call metod reset
        const inputs: NodeListOf<FormField> = this.shadowRoot.querySelectorAll("form-field");

        // for listing
        //TODO change class name
        const subForms: NodeListOf<EntityForm> = this.shadowRoot.querySelectorAll("entity-form.sub_form");
        subForms.forEach((subForm) => {
            if (!values[subForm.getAttribute("property-name")]) {
                values[subForm.getAttribute("property-name")] = []
            }
            values[subForm.getAttribute("property-name")].push(subForm.value().values);
        });

        // main values
        inputs.forEach((input, i) => values[input.propertyName] = input.value);

        this.shadowRoot.querySelectorAll("[input-holder]")
            .forEach((ele: any) => console.log("value on some", ele.getValue))
        this.shadowRoot.querySelectorAll("select-input")
            .forEach((ele: SelectInput) => values[ele.propertyName] = ele.getValue)

        this.shadowRoot.querySelectorAll("multi-select")
            .forEach((ele: MultiselectComponent) => values[ele.propertyName] = ele.getValue)
        return {inputs, values};
    }

    public submit() {
        const {values} = this.value();
        const submitEvent = new CustomEvent("submit", {detail: {values: values}})

        this.dispatchEvent(submitEvent)
    }


    @Attribute('configurations')
    public processConfigurations(configStr: any) {
        let configObj = configStr;
        if (typeof configStr === "string") {
            configObj = JSON.parse(configStr);
        }
        this.configurations = configObj

    }

    public set configurations(config: FormFieldDescription[]) {
        this._configurations = config;
        this.buildForm(config);
    }

    private buildForm(values: FormFieldDescription[]) {
        if (!values || !Array.isArray(values)) {
            return;
        }
        if (!this.mainElement) {
            this.mainElement = this.shadowRoot.querySelector(".form");
        }

        values
            .filter(c => c.type !== "silent")
            .forEach((value) => {
                if (value.type === "select") {

                    const select = document.createElement("select-input");
                    select.setAttribute("value-path", value.valuePath);
                    select.setAttribute("label-path", value.labelPath);
                    select.setAttribute("source", value.source);
                    select.setAttribute("label", value.label);
                    select.setAttribute("options", JSON.stringify(value.options));

                    select.setAttribute("options-loader", JSON.stringify(value.optionsLoader));

                    select.setAttribute("property-name", value.propertyName);
                    select.style.width = String(value.width || "100%");
                    this.mainElement.appendChild(select);

                } else if (value.type === "multi-select") {

                    const select = document.createElement("multi-select");
                    select.setAttribute("value-path", value.valuePath);
                    select.setAttribute("placeholder", value.placeholder);
                    select.setAttribute("label-path", value.labelPath);
                    select.setAttribute("source", value.source);
                    select.setAttribute("label", value.label);
                    select.setAttribute("options", JSON.stringify(value.options));
                    select.setAttribute("options-loader", JSON.stringify(value.optionsLoader));
                    select.setAttribute("property-name", value.propertyName);
                    select.style.width = String(value.width || "100%");
                    this.mainElement.appendChild(select);

                } else if (value.type === "list") {
                    // let nestedForm = this.createSubFormFRomDescription(value);
                    // need to do extendable list element with and ADD and X to remove elements
                    let addButton = document.createElement("button")
                    // append singular as a list should end on "S"
                    addButton.innerText = `Add New ${value.label.slice(0, value.label.length - 1)}`
                    addButton.addEventListener("click", () => {
                        const newNestedForm = this.createSubFormFRomDescription(value);
                        this.mainElement.appendChild(newNestedForm);
                    });
                    this.mainElement.appendChild(addButton)

                } else {
                    // Appending regular input types
                    let formField: FormField = document.createElement("form-field") as FormField

                    formField.setAttribute("label", value.label);
                    formField.setAttribute("property-name", value.propertyName);
                    formField.setAttribute("type", value.type);
                    formField.style.width = String(value.width || "100%");
                    if (value.defaultValue) {
                        formField.setValue(value.defaultValue)
                    }
                    this.mainElement.appendChild(formField)
                }


            })
    }

    private createSubFormFRomDescription(value: FormFieldDescription) {
        let nestedForm: EntityForm = document.createElement("entity-form") as EntityForm;
        nestedForm.classList.add("sub_form")
        // metadata for building parent
        nestedForm.setAttribute("property-name", value.propertyName);
        nestedForm.configurations = value.subDescriptions;
        nestedForm.shadowRoot.querySelector("button")?.setAttribute("hidden", "by sub")
        return nestedForm;
    }

}


