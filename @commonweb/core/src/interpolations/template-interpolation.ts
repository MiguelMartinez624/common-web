import {extractData} from "../html_manipulation";
import {Interpolation} from "./index";

/*
* Evaluate the entire innerHTML to generate TemplateInterpolations
* */
export function generateTemplateInterpolations(root: Element, childList: Element[], interpolations: Map<string, Interpolation[]>) {

    childList
        .forEach((child) => {

            [...child.childNodes]
                .filter((n: HTMLElement) => n.nodeName === "#text")
                .forEach((node: HTMLElement) => {
                    const matches = node.textContent.matchAll(/\{\{(.*?)\}\}/g);
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

            generateTemplateInterpolations(root, [...child.children], interpolations);

        });

}


export class TemplateInterpolation implements Interpolation {
    private prevValue: string;

    constructor(
        // root should reference the component no the parent
        public readonly root: Element,
        public readonly element: Element,
        public readonly propertyPath: string,
        public readonly pattern: string) {

        const value = extractData(propertyPath, this.root) || "";
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
