import {CustomElementConfig, PROCESSOR_KEY, WebComponent} from "./web_components";
import {Attribute} from "./attributes";

export * from './interpolations';
export * from './web_components';
export * from './html_manipulation';
export * from './storage';
export * from './events';
export * from './attributes';
export * from './components';

class ComponentBuilder {

    constructor(
        private readonly config: CustomElementConfig,
        private readonly attributes: any[] = []) {
    }


    with_attribute(attributeName: string, defaultValue: any): ComponentBuilder {
        this.attributes.push({attributeName: attributeName, defaultValue});
        return this;
    }

    build(): void {

        const attributes = this.attributes;
        console.log(attributes)
        let raw = class extends HTMLElement {
            constructor(...args) {
                super();

                // Need to iniciatailize and append the properties to the class so they can be available
                // while evaluating interpolations
                attributes.forEach((attr) => {
                    Attribute(attr.attributeName)(this, attr.attributeName);
                    for (const {attributeName, defaultValue} of attributes) {
                        this[attributeName] = defaultValue;
                    }
                });
            }

            public static get observedAttributes(): string[] {
                return [...attributes.map(v => v.attributeName)];
            }
        };


        WebComponent(this.config)(raw);
    }


}

// Need to register the builder to be able to extends all this features this way
window['RegisterWebComponent'] = (config: CustomElementConfig) => {
    return new ComponentBuilder(config);
}
// if there are not any processor yet start the empty array;
if (!window[PROCESSOR_KEY]) {
    window[PROCESSOR_KEY] = [];
}
