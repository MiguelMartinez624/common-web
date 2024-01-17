import {Attribute, findNodeOnUpTree, WebComponent, extractData} from "@commonweb/core";
import {isJSON} from "@commonweb/core/src";

/*
    ElementBind will bind a element and a property/event/method
    to be used on a easy way.
 */
export class ElementBind {
    private readonly elementSelector: string;
    private readonly elementProperty: string;
    private _element: any;

    constructor(public readonly value: string) {
        const sections = value.split(":");
        // TODO: need toi validate the length of this strings to avoid out of index errors
        this.elementSelector = sections[0][0] === "@" ? sections[0].slice(1) : sections[0];
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

    public get propertyValue(): any {
        switch (this.elementProperty[0]) {
            case "(":
                throw {message: "Functionality for events is not implemented yet"}
            case  "[":
                const value = this._element[this.propertyName] || this._element.getAttribute(this.propertyName);
                return value
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


@WebComponent({
    selector: 'bind-element',
    template: '',
})
/*
* CallMethodTrigger will connect 2 components passing data and calling method
* on reaction, having a initializer element will trigger a action on a event,
* the data from this event will be pass down as an arg to the target method call
*
*   +-----------------+         +-------------------+         +-----------------+
*   | Element Trigger |-- ON ---| (event) | property|---CALL--| Target Element  |
*   +-----------------+         +-------------------+         +-----------------+
* */
export class BindElementComponent extends HTMLElement {
    private binded: boolean = false;

    static get observedAttributes() {
        return ["from", "to"];
    }

    @Attribute('from')
    public connectFrom(selector: string) {
        this.bindElements();
    }

    @Attribute('to')
    public connectTo(selector: string) {
        this.bindElements();
    }

    private bindElements() {
        const fromSelector = this.getAttribute("from");
        const toSelector = this.getAttribute("to");
        if (!fromSelector || !toSelector || this.binded) {
            return;
        }

        const triggerQuery = new ElementBind(fromSelector);
        const triggerElement: any = triggerQuery.searchElement(this);

        switch (triggerQuery.propertyType) {
            case "event":
                triggerElement.addEventListener(triggerQuery.propertyName, this.affectTarget.bind(this));
                break
            default:
                console.error(`[${triggerQuery.propertyType}] trigger method under development`)
        }
        this.binded = true;
    }

    private affectTarget(ev: CustomEvent): void {
        let data = null

        if (this.getAttribute("value")) {
            const value = this.getAttribute("value");
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                data = value;
            } else if (isJSON(value)) {
                data = JSON.parse(value);
            }
        } else if (this.getAttribute("input-src")) {
            const sourceInputQuery = new ElementBind(this.getAttribute("input-src"));
            const elementSource = sourceInputQuery.searchElement(this);
            if (!elementSource) {
                return;
            }

            const field = elementSource[sourceInputQuery.propertyName]
            data = typeof field === 'function' ? field() : field;

        }
        // get the value from the event
        else if (this.getAttribute("input-path")) {
            data = extractData(this.getAttribute("input-path"), ev);
        }
        // Default path from CustomEvents
        else if (ev.detail) {
            data = ev.detail.data;
        }
        // We get the trigger here
        const targetQuery = new ElementBind(this.getAttribute("to"));
        const targetElement = targetQuery.searchElement(this) as HTMLElement;
        if (!targetElement) {
            return;
        }

        switch (targetQuery.propertyType) {
            case "method":
                // For method call
                if (targetElement[targetQuery.propertyName]) {
                    targetElement[targetQuery.propertyName](data)
                }
                break;
            case "attribute":
                targetElement.setAttribute(targetQuery.propertyName, data)
                break;
            default:
                console.error(`[${targetQuery.propertyType}] method under development`)
        }

    }

}
