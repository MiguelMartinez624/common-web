import {extractData} from "./html_manipulation";

export class TemplateInterpolation {
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
