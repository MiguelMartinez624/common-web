import {findNodeOnUpTree} from "../dist/lib";
import {extractData} from "./html_manipulation";

export class Transformer {
    private readonly elementSelector: string;
    private readonly elementProperty: string;
    private element: HTMLElement;

    constructor(public readonly value: string) {
        const sections = value.split(":");
        this.elementSelector = sections[0]
        this.elementProperty = sections[1];

    }

    public get propertyName(): string {
        switch (this.elementProperty[0]) {
            case "(":
            case  "[":
                return this.elementProperty.slice(1, this.elementProperty.length - 1);
            default:
                return this.elementProperty;

        }
    }

    public get propertyType(): 'event' | 'attribute' | 'method' {
        switch (this.elementProperty[0]) {
            case "(":
                return 'event';
            case "[":
                return 'attribute';
            default:
                return 'method';

        }
    }

    // Can be cached?
    public searchElement(initialNode: Node): Node | null {
        return findNodeOnUpTree(this.elementSelector, initialNode);
    }
}


export class TemplateInterpolation {
    private prevValue: string;

    constructor(
        public readonly root: Element,
        public readonly element: Element,
        public readonly propertyPath: string,
        public readonly pattern: string) {

        const value = extractData(propertyPath, this.root);

        this.prevValue = value;
        element.innerHTML = element.innerHTML
            .replace(`{{${propertyPath}}}`, `${pattern}${value}${pattern}`);
        console.log(`{{${propertyPath}}}`, element.innerHTML)
    }

    public update(): void {
        const value = extractData(this.propertyPath, this.root);
        this.element.innerHTML = this.element.innerHTML
            .replace(`<!--${this.propertyPath}-->${this.prevValue}<!--${this.propertyPath}-->`, `<!--${this.propertyPath}-->${value}<!--${this.propertyPath}-->`);
    }
}