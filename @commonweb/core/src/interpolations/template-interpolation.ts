import {extractData} from "../html_manipulation";
import {Interpolation} from "./index";

/*
* Evaluate the entire innerHTML to generate TemplateInterpolations
* */
export function generateTemplateInterpolations(root: Element, childList: Element[], interpolations: Map<string, Interpolation[]>) {
    childList.forEach((child) => {
        [...child.childNodes]
            // Are this the only nodes that can contain text like this?
            .filter(n => n.nodeName === "#text")
            .forEach((node: HTMLElement) => {
                let textContent = node.textContent;
                const matches = textContent.matchAll(/\{\{(.*?)\}\}/g);
                for (const match of matches) {
                    const propertyPath = match[1];
                    const interpolation = new TemplateInterpolation(root, node, propertyPath, `<!--${propertyPath}-->`);
                    /*
                     * Need to attach this interpolation to the properties
                     * */
                    // TODO this peace of code can be moved to a collection style as is used on many part
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
            })
        // TODO logic for create tempaltes

        generateTemplateInterpolations(root, [...child.children], interpolations);

    });
    // let innerHTML = (root as HTMLElement).innerText;
    // const matches = innerHTML.matchAll(/\{\{(.*?)\}\}/g);
    // for (const match of matches) {
    //
    //     const propertyPath = match[1];
    //     const interpolation = new TemplateInterpolation(root, root, propertyPath, `<!--${propertyPath}-->`);
    //     /*
    //      * Need to attach this interpolation to the properties
    //      * */
    //     let attributeName = match[1].replace("@host.", "");
    //     const nextDot = attributeName.indexOf(".");
    //     if (nextDot > -1) {
    //         attributeName = attributeName.slice(0, nextDot)
    //     }
    //
    //     let interpolationsStored = interpolations.get(attributeName);
    //     if (!interpolationsStored) {
    //         interpolations.set(attributeName, [interpolation]);
    //         continue;
    //     }
    //     interpolationsStored.push(interpolation);
    // }
}

// Attributes that are not reflected on the template this only true for components that start empty
export function evaluateTemplateInterpolation(child: Element, root: Element, interpolations: Map<string, Interpolation[]>) {

    let innerHTML = child.innerHTML;
    const matches = innerHTML.matchAll(/\{\{(.*?)\}\}/g);
    for (const match of matches) {

        const propertyPath = match[1];
        const interpolation = new TemplateInterpolation(root, child, propertyPath, `<!--${propertyPath}-->`);
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
}

export class TemplateInterpolation implements Interpolation {
    private prevValue: string;
    private attributesInterpolation: Map<string, string> = new Map();

    constructor(
        // TODO root is taking the parent but hwat happents when the parent is a some of the componentn?
        // root should reference the component no the parent
        public readonly root: Element,
        public readonly element: Element,
        public readonly propertyPath: string,
        public readonly pattern: string) {
        const value = extractData(propertyPath, this.root) || "";
        // Get all the attributes that need changes
        // style may not work at lest that we change the whole string
        // for this cases will need to create a custom attribute for style changing

        this.prevValue = value;
        element.textContent = element.textContent
            .replace(`{{${propertyPath}}}`, `${value}`);


    }

    public update(): void {

        const value = extractData(this.propertyPath, this.root) || "";
        if (this.prevValue === value) {
            return;
        }

        let newHTML = this.element
            .textContent
            .replace(this.prevValue, value);


        // clear attributes
        this.element.textContent = newHTML;
        this.prevValue = value;
    }
}
