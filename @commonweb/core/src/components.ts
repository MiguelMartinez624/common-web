import {attemptBindEvents} from "./events";
import {syncWithStorage} from "./storage";

interface CustomElementConfig {
    selector: string;
    template: string;
    style?: string;
}

const validateSelector = (selector: string) => {
    if (selector.indexOf('-') <= 0) {
        throw new Error('You need at least 1 dash in the custom element name!');
    }
};


function insertTemplate(attr: CustomElementConfig) {
    //TODO casted may no be required
    const casted = (this as unknown as HTMLElement)
    const shadowRoot = casted.attachShadow({mode: 'open'});
    const template = document.createElement("template");

    template.innerHTML = attr.style ? `<style>${attr.style}</style>${attr.template}` : attr.template;
    shadowRoot.appendChild(template.content.cloneNode(true));
    return casted;
}

export function WebComponent(attr: CustomElementConfig) {
    return function _WebComponent<T extends { new(...args: any[]): {} }>(constr: T) {

        validateSelector(attr.selector)

        let component = class extends constr {
            casted: any;

            constructor(...args: any[]) {
                super(...args)
                this.casted = insertTemplate.call(this, attr);
                // we init the listeners
                attemptBindEvents((this as unknown as HTMLElement));

                syncWithStorage(this);

            }

            attributeChangedCallback(name, oldValue, newValue) {
                // if you didn't use the notation wont have this field set.
                if ((this as any).attribute_list) {
                    const handler = (this as any).attribute_list.get(name);
                    if (handler) {
                        if (typeof newValue === 'string' && isJSON(newValue)) {
                            return handler.apply(this, [JSON.parse(newValue)])
                        }
                        handler.apply(this, [newValue])
                    }
                }
            }

        }


        window.customElements.define(attr.selector, component as any);
        return component;
    }
}


export function isJSON(str) {
    try {
        JSON.stringify(JSON.parse(str));
        return true;
    } catch (e) {
        return false;
    }
}

