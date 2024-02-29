import {syncWithStorage} from "./storage";

import {

    generateAttributesInterpolations,
    generateTemplateInterpolations,
    Interpolation
} from "./interpolations";

export class CustomElementConfig {
    selector: string;
    template: string;
    style?: string;
    useShadow?: boolean = true;
    directives?: any[] = [];
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
    if (!attr.useShadow) {
        casted.innerHTML = attr.style ?
            `<style>${attr.style}</style>${attr.template}` : attr.template;
    } else {
        const shadowRoot = casted.attachShadow({mode: 'open'});
        const template = document.createElement("template");

        template.innerHTML = attr.style ?
            `<style>${attr.style}</style>${attr.template}` : attr.template;
        shadowRoot.appendChild(template.content.cloneNode(true));

    }
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
export function bindTemplateToProperties(root: HTMLElement) {
    const interpolations = new Map<string, Interpolation[]>();

    const childrens = root.shadowRoot ? [...root?.shadowRoot?.children, ...root.children] : [...root.children];
    // Bind Attribute Interpolations
    // childs should be the parameter

    generateAttributesInterpolations(root, childrens, interpolations);

    generateTemplateInterpolations(root, childrens, interpolations);
    (root as any).interpolations = interpolations;
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

        if (attr.useShadow === undefined) {
            attr.useShadow = true
        }
        validateSelector(attr.selector)

        let component = class extends constr {
            constructor(...args: any[]) {
                super(...args);

                    // Whats the different for a framework component ?.
                    (this as any).directives = attr.directives;

            }


            attributeChangedCallback(name, oldValue, newValue) {
                updateAttributes(this, name, newValue);
                this.checkInterpolationsFor(name);
            }


            /**
             * Check and run all the directives
             *
             * */
            public wireTemplate() {
                // Enhance with directives
                if (this['directives']) {
                    this['directives'].forEach(d => d.call(this))
                }
                if (this['checkInterpolations']) {
                    // Whats the different for a framework component ?.
                    (this as any).checkInterpolations();

                }

            }


            public connectedCallback() {
                insertTemplate.call(this, attr);
                this.wireTemplate();
                syncWithStorage(this as unknown as HTMLElement);
                this["checkAllInterpolations"]();
                if (super["connectedCallback"]) {
                    super["connectedCallback"]();
                }
            }

            public checkInterpolationsFor(name) {
                const interpolations = (this as any).interpolations;
                // if you didn't use the notation wont have this field set.
                if (interpolations) {
                    const interpolationsList = interpolations.get(name);
                    if (interpolationsList) {
                        interpolationsList.forEach((interpolation: Interpolation) => interpolation.update())
                    }
                }
            }

            public checkAllInterpolations() {
                const interpolations = (this as any).interpolations;
                // if you didn't use the notation wont have this field set.
                if (interpolations) {
                    for (const [key, interpolationList] of interpolations) {
                        interpolationList.forEach((interpolation: Interpolation) => interpolation.update())
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

