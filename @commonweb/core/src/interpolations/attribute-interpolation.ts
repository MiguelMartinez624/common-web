import {extractData} from "../html_manipulation";
import {Interpolation} from "./index";

export function generateAttributesInterpolations(root: Element, childList: any[], interpolations: Map<string, Interpolation[]>) {
    childList.forEach((child) => {
        //TODO generate attributrs with thos too mother fucker


        // like for-each
        const attributes: Map<string, any> = (child as any).attribute_list;
        if (attributes) {
            for (const [key, value] of attributes) {
                // so should all of this be function?
                // if (typeof value === "function") {
                evaluateInterpolationKey(child, root, key, interpolations);
                // }
            }
        }


        [...child.attributes]
            .filter(a => (a.value as string).match(/\{\{(.*?)\}\}/g) !== null)
            .forEach(({name, value}) => {
                // push interpolation
                const propertyPath = value.replace("{{", "").replace("}}", "");
                let attributeName = propertyPath.replace("@host.", "");
                // root.innerHTML = root.innerHTML.replace(`="{{${propertyPath}}}`, `=""`)
                // (child as any).attribute_list.set(name, name);
                const interpolation = new AttributeInterpolation(root, child, propertyPath, name);

                let interpolationsStored = interpolations.get(attributeName);
                if (!interpolationsStored) {
                    interpolations.set(attributeName, [interpolation]);
                    return;
                }
                interpolationsStored.push(interpolation);

            })


        generateAttributesInterpolations(root, [...child.children], interpolations);
    });
}

// Attributes that are not reflected on the template this only true for components that start empty
export function evaluateInterpolationKey(child: Element, node: Element, key: string, interpolations: Map<string, Interpolation[]>) {
    if(!child.getAttribute(key)){
        return;
    }
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

    constructor(
        // TODO root is taking the parent but hwat happents when the parent is a some of the componentn?
        // root should reference the component no the parent
        public readonly root: Element,
        public readonly element: Element,
        public readonly propertyPath: string,
        public readonly attributeName: string) {

        const value = extractData(propertyPath, this.root);
        // first interpolation need to replace the code

        // objects and arrays will be always pass by setter if posible
        this.updateValue(value);

    }

    public update(): void {

        const value = extractData(this.propertyPath, this.root);
        if (this.prevValue === value) {
            return;
        }
        this.updateValue(value);
        this.prevValue = value;
    }


    private updateValue(value: string) {
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

}

