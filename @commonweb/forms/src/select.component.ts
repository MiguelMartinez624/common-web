import {Attribute, WebComponent} from "@commonweb/core";

const getObjectPropertyValue = (path: string, obj: any, separator = '.') => {
    let properties = Array.isArray(path) ? [path] : path.split(separator)
    return properties.reduce((prev: any, curr: any) => prev?.[curr], obj)
}

export interface SelectOption {
    label: string;
    value: string; // only strings?
}

export interface ValueInput {
    getValue: any;
}

@WebComponent({
    selector: 'select-input',
    template: `
        <label for="select-input"></label>
        <select name="select-input"></select>\`
    `
})
export class SelectInput extends HTMLElement {
    static get observedAttributes() {
        return ["label-path", "value-path", "label", "property-name"];
    }


    @Attribute('label')
    public updateLabel(label: string) {
        this.shadowRoot.querySelector("label").innerHTML = label;
    }

    @Attribute('options')
    public updateOptions(options: any[]) {
        if (!options || !Array.isArray(options)) {
            return;
        }
        // Clear the options
        const select = this.shadowRoot.querySelector("select");
        select.innerHTML = "";

        const labelPath = this.getAttribute("label-path");
        const valuePath = this.getAttribute("value-path");

        // Get data from the options
        options
            .map((item: any) => {
                // TODO validate and add ignore policis as a param
                return {
                    value: getObjectPropertyValue(valuePath, item, "."),
                    label: getObjectPropertyValue(labelPath, item, "."),
                } as SelectOption;
            })
            // Span one html element per option
            .forEach((option: SelectOption) => {
                const optionElement = document.createElement("option");
                optionElement.value = option.value;
                optionElement.label = option.label;
                select.appendChild(optionElement);
            });
    }


    get propertyName() {
        return this.getAttribute("property-name");
    }

    public get getValue(): any {
        const select = this.shadowRoot.querySelector("select");
        return select.value;
    }
}


