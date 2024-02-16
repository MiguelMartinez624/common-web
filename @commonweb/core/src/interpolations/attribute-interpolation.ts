import {extractData} from "../html_manipulation";
import {Interpolation} from "./index";

export function generateAttributesInterpolations(root: Element, childList: any[], interpolations: Map<string, Interpolation[]>) {
    childList.forEach((child) => {
        // like for-each
        const attributes: Map<string, any> = (child as any).attribute_list;
        if (attributes) {
            for (const [key, value] of attributes) {
                // so should all of this be function?
                if (typeof value === "function") {
                    evaluateInterpolationKey(child, root, key, interpolations);
                }
            }
        }
        generateAttributesInterpolations(root, [...child.children], interpolations);
    });
}

// Attributes that are not reflected on the template this only true for components that start empty
export function evaluateInterpolationKey(child: Element, node: Element, key: string, interpolations: Map<string, Interpolation[]>) {
    const matches = child.getAttribute(key).matchAll(/\{\{(.*?)\}\}/g);
    for (const match of matches) {
        const propertyPath = match[1];
        let attributeName = match[1].replace("@host.", "");

        const interpolation = new AttributeInterpolation(node, child, propertyPath, key);
        /*
         * Need to attach this interpolation to the properties
         * */
        const nextDot = attributeName.indexOf(".");
        if (nextDot > -1) {
            attributeName = attributeName.slice(0, nextDot)
        }
        // child.innerHTML = child.innerHTML.replace(`="{{${propertyPath}}}`, `=""`)

        let interpolationsStored = interpolations.get(attributeName);
        if (!interpolationsStored) {
            interpolations.set(attributeName, [interpolation]);
            continue;
        }
        interpolationsStored.push(interpolation);

    }
}


export class AttributeInterpolation implements Interpolation {
    private prevValue: string;
    private attributesInterpolation: Map<string, string> = new Map();

    constructor(
        // TODO root is taking the parent but hwat happents when the parent is a some of the componentn?
        // root should reference the component no the parent
        public readonly root: Element,
        public readonly element: Element,
        public readonly propertyPath: string,
        public readonly attributeName: string) {
        debugger
        const value = extractData(propertyPath, this.root);

        // objects and arrays will be always pass by setter if posible
        if (typeof value === "object" && typeof this.element[this.attributeName] === "function") {
            // Need to make sure that attribute that receive objects are setter?
            this.element[this.attributeName](value)
        } else if (typeof value === "object") {
            // Required??
            this.element[this.attributeName] = value;
        } else {
            this.element.setAttribute(this.attributeName, value);
        }

    }

    public update(): void {
        debugger
        const value = extractData(this.propertyPath, this.root);
        if (this.prevValue === value) {
            return;
        }

        // objects and arrays will be always pass by setter if posible
        if (typeof value === "object" && typeof this.element[this.attributeName] === "function") {
            // Need to make sure that attribute that receive objects are setter?
            this.element[this.attributeName](value)
        } else if (typeof value === "object") {
            // Required??
            this.element[this.attributeName] = value;
        } else {
            this.element.setAttribute(this.attributeName, value);
        }

        this.prevValue = value;
    }
}

