import {CustomElementConfig, WebComponent} from "./web_components";
import {FrameworkComponent} from "./framework-component";
import {Attribute} from "./attributes";
import {checkShowIfDirective} from "./directives";

export class ComponentBuilder {

    /**
     * Creates a new ComponentBuilder instance.
     *
     * @param {CustomElementConfig} config - The configuration object for the custom element.
     * @param {any[]} [attributes=[]] - An optional array of attribute definitions.
     * @param {any[]} [methods=[]] - An optional array of method definitions.
     * @param {any[]} [initStack=[]] - An optional array of initialization functions.
     */
    constructor(
        private readonly config: CustomElementConfig,
        private readonly attributes: any[] = [],
        private readonly methods: any[] = [],
        private readonly initStack: any[] = []) {
    }


    /**
     * Adds a new attribute definition to the component.
     *
     * @param {string} attributeName - The name of the attribute.
     * @param {any} defaultValue - The default value of the attribute.
     * @returns {ComponentBuilder} This instance for chaining.
     */
    with_attribute(attributeName: string, defaultValue: any): ComponentBuilder {
        this.attributes.push({attributeName: attributeName, defaultValue});
        return this;
    }


    /**
     * Adds a new method definition to the component.
     *
     * @param {string} methodName - The name of the method.
     * @param {any} handler - The function to be used as the method handler.
     * @returns {ComponentBuilder} This instance for chaining.
     */with_method(methodName: string, handler: any): ComponentBuilder {
        this.methods.push({methodName, handler});
        return this;
    }

    /**
     * Adds an initialization function to be called when the component is created.
     *
     * Initialization functions are executed in the order they are added.
     *
     * **Important:** Be aware that arrow functions passed to this method will lose their context (`this`).
     * To ensure `this` refers to the component instance, use standard functions instead.
     *
     * @param {function} handler - The function to be called during initialization.
     * @returns {ComponentBuilder} This instance for chaining.
     */
    on_init(handler: any): ComponentBuilder {
        this.initStack.push(handler);
        return this;
    }


    /**
     * Builds the final custom element class definition.
     *
     * @returns {void}
     */
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


        WebComponent({...this.config, directives: [ checkShowIfDirective]})(raw);
    }


}
