import {Interpolation} from "./index";
import {ElementBind} from "../bindings";


/**
 * Recursively generates interpolation objects for attributes within a root element and its children.
 *
 * @param {Element} root - The root element to start with.
 * @param {any[]} childList - A list of child elements to process.
 * @param {Map<string, Interpolation[]>} interpolations - A Map to store created interpolations by attribute name.
 */
export function generateAttributesInterpolations(root: Element, childList: any[], interpolations: Map<string, Interpolation[]>) {
    childList
        .forEach((child) => {
            const attributes: Map<string, any> = (child as any).attribute_list;
            if (attributes) {
                for (const [key, value] of attributes) {
                    evaluateInterpolationKey(child, root, key, interpolations);
                }
            }

            [...child.attributes]
                .filter(a => (a.value as string).match(/\{\{(.*?)\}\}/g) !== null)
                .forEach(({name, value}) => {
                    const propertyPath = value.replace("{{", "").replace("}}", "");
                    let attributeName = propertyPath.slice(propertyPath.indexOf(":") + 1);

                    const interpolation = new AttributeInterpolation(child, propertyPath, name);
                    let interpolationsStored = interpolations.get(attributeName);
                    if (!interpolationsStored) {
                        interpolations.set(attributeName, [interpolation]);
                        return;
                    }
                    interpolationsStored.push(interpolation);

                });

            generateAttributesInterpolations(root, [...child.children], interpolations);
        });
}

/**
 * Evaluates a specific attribute key with interpolation syntax for a given element.
 *
 * @param {Element} child - The element with the attribute to evaluate.
 * @param {Element} node - The root node for data extraction.
 * @param {string} key - The attribute key to evaluate.
 * @param {Map<string, Interpolation[]>} interpolations - The Map to store created interpolations.
 */
export function evaluateInterpolationKey(child: Element, node: Element, key: string, interpolations: Map<string, Interpolation[]>) {
    if (!child.getAttribute(key)) {
        return;
    }
    const matches = child.getAttribute(key).matchAll(/\{\{(.*?)\}\}/g);
    for (const match of matches) {
        const propertyPath = match[1];
        // TODO use the @to indicate WHO is gonna be the root source for the data
        let attributeName = match[1].replace("@host:", "");

        const interpolation = new AttributeInterpolation(child, propertyPath, key);
        /*
         * Need to attach this interpolation to the properties
         * */
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
}


/**
 * Represents an interpolation for an attribute, handling its updates.
 */
export class AttributeInterpolation implements Interpolation {
    private prevValue: string;
    private readonly root: Node;
    private elementBind: ElementBind;

    constructor(
        public readonly element: Element,
        public readonly propertyPath: string,
        public readonly attributeName: string) {

        this.elementBind = new ElementBind(element, propertyPath);
        this.root = this.elementBind.searchElement(element);


    }

    public update(): void {

        const value = this.elementBind.value;
        if (this.prevValue === value || (typeof value === "string" && value.startsWith("{{"))) {
            return;
        }
        if (!value) {
            return
        }
        this.updateValue(value);
        this.prevValue = value;
    }


    private updateValue(value: any) {
        const toUpdate = this.element[this.attributeName];
        if (!value && this.attributeName === "for-each") {
            // dont do nothing for nested component for each
            return;
        }
        if (this.element.hasOwnProperty("update")) {
            this.element[this.attributeName] = value;
            (this.element as any).update();
            return;
        }

        if (typeof value === "object" && typeof toUpdate === "function") {
            // Need to make sure that attribute that receive objects are setter?
            toUpdate.apply(this.element, value)
        } else if (typeof value === "object") {
            // Required??
            this.element[this.attributeName] = value;
            if (this.element['checkInterpolationsFor']) {
                this.element['checkInterpolationsFor'](this.attributeName);
            }

        } else {
            this.element.setAttribute(this.attributeName, value);
        }
    }

}

