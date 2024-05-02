import {
    appendInterpolationServer,

    generateAttributesInterpolations,
    generateTemplateInterpolations,
    Interpolation
} from "./interpolations";
import {appendComponent, IComponent} from "./IComponent";
import {QueryBuilder} from "./html_manipulation";
import {appendLoopServer} from "./components";
import {appendCSSController} from "./components/css-controller.component";
import {HtmlControllerComponent} from "./components/html-controller.component";

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


                appendInterpolationServer(this);
                appendLoopServer(this);
                appendCSSController(this);
                appendComponent(this, new HtmlControllerComponent())

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
                insertTemplate.call(this, attr);

                if ((this as any).servers) {
                    (this as any).servers.forEach(s => s.onInit());
                }

                if (super["connectedCallback"]) {
                    super["connectedCallback"]();
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

