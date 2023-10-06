import {Attribute, EventBind, WebComponent} from "@commonweb/core";
import {FormField, FormFieldDescription} from "./form_field.component";
import {SelectInput} from "./select.component";


@WebComponent({
    selector: 'entity-form',
    template: `<div class="form"></div>`,
    style: `:host{
                color: var(--font-color, black);
                width:100%;
               }
            .form {
               
              display:flex;
              flex-direction: column;
            }
            .form_field {
               padding:1rem;
               
               border: 1px solid var(--item-border-color, gray);
               margin:0.5em;
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
        // should no return should call metod reset
        const inputs: NodeListOf<FormField> = this.shadowRoot.querySelectorAll("form-field");

        // for listing
        //TODO change class name
        const subForms: NodeListOf<EntityForm> = this.shadowRoot.querySelectorAll("entity-form.sub_form");
        subForms.forEach((subForm) => {
            if (!values[subForm.getAttribute("property")]) {
                values[subForm.getAttribute("property")] = []
            }
            values[subForm.getAttribute("property")].push(subForm.value().values);
        });

        // main values
        inputs.forEach((input, i) => values[input.propertyName] = input.value);

        this.shadowRoot.querySelectorAll("[input-holder]")
            .forEach((ele: any) => console.log("value on some", ele.getValue))
        this.shadowRoot.querySelectorAll("tt-select")
            .forEach((ele: SelectInput) => values[ele.propertyName] = ele.getValue)

        // send method on return values
        this.reset();
        return {inputs, values};
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
        this.buildForm(config);
    }

    private buildForm(values: FormFieldDescription[]) {
        if (!values || !Array.isArray(values)) {
            return;
        }
        if (!this.mainElement) {
            this.mainElement = this.shadowRoot.querySelector(".form");
        }

        values.forEach((value) => {
            if (value.type === "select") {
                console.log({value})
                const select = document.createElement("tt-select");
                select.setAttribute("value-path", value.valuePath);
                select.setAttribute("label-path", value.labelPath);
                select.setAttribute("source", value.source);
                select.setAttribute("label", value.label);
                select.setAttribute("property-name", value.propertyName);
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
                let formField = document.createElement("form-field")

                formField.setAttribute("label", value.label);
                formField.setAttribute("property-name", value.propertyName);
                formField.setAttribute("type", value.type);
                this.mainElement.appendChild(formField)
            }


        })
    }

    private createSubFormFRomDescription(value: FormFieldDescription) {
        let nestedForm: EntityForm = document.createElement("entity-form") as EntityForm;
        nestedForm.classList.add("sub_form")
        // metadata for building parent
        nestedForm.setAttribute("property", value.propertyName);
        nestedForm.configurations = value.subDescriptions;
        nestedForm.shadowRoot.querySelector("button")?.setAttribute("hidden", "by sub")
        return nestedForm;
    }

}


