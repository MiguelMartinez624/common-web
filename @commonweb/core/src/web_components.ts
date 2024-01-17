import {attemptBindEvents} from "./events";
import {syncWithStorage} from "./storage";
import {TemplateInterpolation} from "./transformer";

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

export const PROCESSOR_KEY: string = '_webcommon_components_processors';

function insertTemplate(attr: CustomElementConfig) {
    //TODO casted may no be required
    const casted = (this as unknown as HTMLElement)
    const shadowRoot = casted.attachShadow({mode: 'open'});
    const template = document.createElement("template");

    template.innerHTML = attr.style ?
        `<style>${attr.style}</style>${attr.template}` : attr.template;
    shadowRoot.appendChild(template.content.cloneNode(true));

}

/**
 * Need to create transformers from the templates and clear up those markdowns
 * host stand for the component itself (this) and then it comes the property and any key
 * <div>{{@host.property.key}}</div>
 *
 * Same as before but here we can use a [CSSSelector] to show other elements properties custom or
 * native properties
 * <div>{{[CSSSelector].property.key}}</div>
 */
function bindTemplateToProperties(node: HTMLElement) {
    /*
    * CHeck properties to create a transform for each binding
    * */

    const interpolations = new Map<string, TemplateInterpolation[]>();
    [...node.shadowRoot.children].forEach((child) => {

        let innerHTML = child.innerHTML;
        const matches = innerHTML.matchAll(/\{\{(.*?)\}\}/g);
        for (const match of matches) {

            const propertyPath = match[1];
            const interpolation = new TemplateInterpolation(node, child, propertyPath, `<!--${propertyPath}-->`);
            /*
             * Need to attach this interpolation to the properties
             * */
            let attributeName = match[1].replace("@host.", "");
            const nextDot = attributeName.indexOf(".");
            if (nextDot > -1) {
                attributeName = attributeName.slice(0, nextDot)
            }

            let interpolationsStored = interpolations.get(attributeName);
            if (!interpolationsStored) {
                interpolations.set(attributeName, [interpolation]);
                continue;
            }
            interpolationsStored.push(interpolation);
        }

        (node as any).interpolations = interpolations;

    })
}

function updateAttributes(element: any, name: string, newValue: any) {
    if ((element as any).attribute_list) {
        const handler = (element as any).attribute_list.get(name);
        if (!handler) {
            return;
        }
        const valueToPass = typeof newValue === 'string' && isJSON(newValue) ? JSON.parse(newValue) : newValue;
        // if the content is a object
        if (typeof handler === "function") {
            handler.apply(element, [valueToPass])
        } else {
            // in this case handler is the property name no a value actually
            // so we can index the property on the target
            element[handler] = valueToPass;
        }


    }
}

export function WebComponent(attr: CustomElementConfig) {
    return function _WebComponent<T extends { new(...args: any[]): {} }>(constr: T) {

        validateSelector(attr.selector)

        let component = class extends constr {

            constructor(...args: any[]) {
                super(...args)

                insertTemplate.call(this, attr);

                bindTemplateToProperties(this as unknown as HTMLElement)

                syncWithStorage(this as unknown as HTMLElement);
                attemptBindEvents((this as unknown as HTMLElement));
                if (window[PROCESSOR_KEY]) {
                    window[PROCESSOR_KEY]
                        .forEach(processor => processor(this));
                }

            }

            attributeChangedCallback(name, oldValue, newValue) {
                updateAttributes(this, name, newValue);

                // if you didn't use the notation wont have this field set.
                if ((this as any).interpolations) {
                    const interpolationsList = (this as any).interpolations.get(name);
                    if (interpolationsList) {
                        interpolationsList.forEach((interpolation: TemplateInterpolation) => interpolation.update())
                    }
                }

            }

        }

        if (!window.customElements.get(attr.selector)) {
            window.customElements.define(attr.selector, component as any);
        }

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

