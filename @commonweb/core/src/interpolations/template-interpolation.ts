import {extractData} from "../html_manipulation";
import {Interpolation} from "./index";

export function generateTemplateInterpolations(root: Element, childList: any[], interpolations: Map<string, Interpolation[]>) {
    childList.forEach((child) => {
        evaluateTemplateInterpolation(child, root, interpolations);
    });
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
        const value = extractData(propertyPath, this.root);

        // Get all the attributes that need changes
        // style may not work at lest that we change the whole string
        // for this cases will need to create a custom attribute for style changing
        const regex = /\w+="{{[\s\S]*?}}/g;
        const matches = element.innerHTML.match(regex);
        if (matches) {
            for (const match of matches) {
                const attributeName = match.slice(0, match.indexOf("="))
                this.attributesInterpolation.set(attributeName, propertyPath)
            }
        }


        let newHTML = element.innerHTML.replace(`="{{${propertyPath}}}`, `="${value}`)


        this.prevValue = value;
        element.innerHTML = newHTML
            .replace(`{{${propertyPath}}}`, `${pattern}${value}${pattern}`);


    }

    public update(): void {

        const value = extractData(this.propertyPath, this.root);
        if (this.prevValue === value) {
            return;
        }

        let newHTML = this.element
            .innerHTML
            .replace(`<!--${this.propertyPath}-->${this.prevValue}<!--${this.propertyPath}-->`, `<!--${this.propertyPath}-->${value}<!--${this.propertyPath}-->`);

        for (const [attribute] of this.attributesInterpolation.entries()) {
            newHTML = newHTML
                .replace(`${attribute}="${this.prevValue}`, `${attribute}="${value}`);
        }

        // clear attributes
        this.element.innerHTML = newHTML;
        this.prevValue = value;
    }
}
