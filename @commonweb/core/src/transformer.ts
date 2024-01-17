import {findNodeOnUpTree} from "../dist/lib";
import {extractData} from "./html_manipulation";

export class TemplateInterpolation {
    private prevValue: string;

    constructor(
        public readonly root: Element,
        public readonly element: Element,
        public readonly propertyPath: string,
        public readonly pattern: string) {

        const value = extractData(propertyPath, this.root);

        this.prevValue = value;
        element.innerHTML = element
            .innerHTML
            .replace(`{{${propertyPath}}}`, `${pattern}${value}${pattern}`);
    }

    public update(): void {
        const value = extractData(this.propertyPath, this.root);
        if (this.prevValue === value) {
            return;
        }
        this.element.innerHTML = this.element
            .innerHTML
            .replace(`<!--${this.propertyPath}-->${this.prevValue}<!--${this.propertyPath}-->`, `<!--${this.propertyPath}-->${value}<!--${this.propertyPath}-->`);
        this.prevValue = value;
    }
}