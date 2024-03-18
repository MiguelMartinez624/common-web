import {CustomElementConfig, WebComponent} from "./web_components";
import {Attribute} from "./attributes";
import {FrameworkComponent} from "./framework-component";
import {checkShowIfDirective, enhanceClassChange, forEachDirective} from "./directives";

export * from './framework-component';

export * from './interpolations';
export * from './web_components';
export * from './html_manipulation';
export * from './storage';
export * from './attributes';
export * from './directives';
export * from './bindings';


class ComponentBuilder {

    constructor(
        private readonly config: CustomElementConfig,
        private readonly attributes: any[] = [],
        private readonly methods: any[] = [],
        private readonly initStack: any[] = []) {
    }


    with_attribute(attributeName: string, defaultValue: any): ComponentBuilder {
        this.attributes.push({attributeName: attributeName, defaultValue});
        return this;
    }

    with_method(methodName: string, handler: any): ComponentBuilder {
        this.methods.push({methodName, handler});
        return this;
    }

    on_init(handler: any): ComponentBuilder {
        this.initStack.push(handler);
        return this;
    }


    build(): void {

        const {attributes, methods, initStack} = this;
        let raw = class extends FrameworkComponent {
            constructor(...args) {
                super();
                methods.forEach(({methodName, handler}) => {
                    this[methodName] = handler.bind(this);
                })
                // Need to initialize and append the properties to the class so they can be available
                // while evaluating interpolations
                attributes.forEach((attr) => {

                    // Attach before all attributes and methods
                    for (const {attributeName, defaultValue} of attributes) {
                        this[attributeName] = defaultValue;
                    }

                    // then create the binding
                    Attribute(attr.attributeName)(this, attr.attributeName);
                });
            }

            connectedCallback() {
                initStack.forEach((f) => f.apply(this))
            }

            public static get observedAttributes(): string[] {
                return [...attributes.map(v => v.attributeName)];
            }
        };


        WebComponent({...this.config, directives: [forEachDirective, checkShowIfDirective, enhanceClassChange]})(raw);
    }


}

// Need to register the builder to be able to extends all this features this way
window['RegisterWebComponent'] = (config: CustomElementConfig) => {
    return new ComponentBuilder(config);
}
