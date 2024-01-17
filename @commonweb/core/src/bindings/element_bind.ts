/*
    ElementBind will bind a element and a property/event/method
    to be used on a easy way.
 */
import {findNodeOnUpTree} from "../html_manipulation";

export class ElementBind {
    private readonly elementSelector: string;
    private readonly elementProperty: string;
    private _element: any;

    constructor(public readonly rawStr: string) {
        const sections = rawStr.split(":");
        // TODO: need toi validate the length of this strings to avoid out of index errors
        this.elementSelector = sections[0];
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

    public get value() {
        switch (this.elementProperty[0]) {
            case "(":
                throw {message: "Functionality for events is not implemented yet"}
            case  "[":
                return this._element[this.propertyName] || this._element.getAttribute(this.propertyName)
            default:
                // todo no params method for now
                return this._element[this.propertyName]();

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
        this._element = findNodeOnUpTree(this.elementSelector, initialNode);
        return this._element;
    }
}

