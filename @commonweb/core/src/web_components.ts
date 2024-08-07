import "reflect-metadata";
import {QueriesKey, QueryResult, WithHTMLController} from "./components";
import {CSSControllerComponent} from "./components/css-controller.component";
import {HtmlControllerComponent} from "./components/html-controller.component";
import {appendComponent, IComponent} from "./components/icomponent";
import {InterpolationComponent} from "./interpolations/component";
import {LooperComponent} from "./components/lopper.component";

export class CustomElementConfig {
    selector: string;
    template: string;
    style?: string;
    useShadow?: boolean = true;
}

const validateSelector = (selector: string) => {
    if (selector.indexOf('-') <= 0) {
        throw new Error('You need at least 1 dash in the custom element name!');
    }
};


export interface WebComponent extends WithHTMLController{
    // update will call all components `onUpdate` method, in the same order they where added
    // to the component
    update(): void;
}

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

                appendComponent(this, new HtmlControllerComponent());
                appendComponent(this, new InterpolationComponent());
                appendComponent(this, new LooperComponent());
                appendComponent(this, new CSSControllerComponent());


                if ((this as any).servers) {
                    (this as any).servers.forEach((s: IComponent) => s.setup(this));
                }
            }


            attributeChangedCallback(name, oldValue, newValue) {
                updateAttributes(this, name, newValue);
                if ((this as any).servers) {
                    (this as any).servers.forEach(s => s.onUpdate());
                }
            }


            public update(): void {
                if ((this as any).servers) {
                    (this as any).servers.forEach((s: IComponent) => s.onUpdate())
                }
            }

            public connectedCallback() {

                if (!attr.useShadow) {
                    (this as unknown as HTMLElement).innerHTML = attr.style ?
                        `<style>${attr.style}</style>${attr.template}` : attr.template;
                } else {
                    const shadowRoot = (this as unknown as HTMLElement).attachShadow({mode: 'open'});
                    const template = document.createElement("template");

                    template.innerHTML = attr.style ?
                        `<style>${attr.style}</style>${attr.template}` : attr.template;
                    shadowRoot.appendChild(template.content.cloneNode(true));

                }


                // Check for queries
                if ((this as any)[QueriesKey]) {
                    const test = (this as any)[QueriesKey];
                    for (const [pattern, fieldName] of test) {
                        this[fieldName] = new QueryResult(pattern, this);
                    }
                }


                if (super["connectedCallback"]) {
                    super["connectedCallback"]();
                }


                if ((this as any).servers) {
                    (this as any).servers.forEach(s => s.onInit());
                }


                // Loading when a element just nit
                if (this['init']) {
                    this['init']();
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

