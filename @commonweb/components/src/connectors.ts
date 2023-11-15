import {Attribute, findNodeOnUpTree, WebComponent,extractData} from "@commonweb/core";

class ElementQuery {
    private readonly elementSelector: string;
    private readonly elementProperty: string;

    constructor(public readonly value: string) {
        const sections = value.split(":");
        this.elementSelector = sections[0]
        this.elementProperty = sections[1];

    }

    public get propertyName(): string {
        switch (this.elementProperty[0]) {
            case "(" || "[":
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
        this.bindElements(selector);
    }

    @Attribute('to')
    public connectTo(selector: string) {
        this.bindElements(selector);
    }

    private bindElements(selector: string) {
        const fromSelector = this.getAttribute("from");
        const toSelector = this.getAttribute("to");
        if (!fromSelector || !toSelector || this.binded) {
            return;
        }

        const triggerQuery = new ElementQuery(fromSelector);
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
        console.log({customEvent: ev})
        let data = null
        console.log("CALLING METHOD")
        // TODO use the extract method here
        // to be checked
        if (this.getAttribute("input-src")) {
            const sourceInputQuery = new ElementQuery(this.getAttribute("input-src"));
            const elementSource = sourceInputQuery.searchElement(this);
            if (!elementSource) {
                return;
            }

            const field = elementSource[sourceInputQuery.propertyName]
            data = typeof field === 'function' ? field() : field;

        } else if (this.getAttribute("input-path")) {
            data = extractData(this.getAttribute("input-path"), ev);

        } else {
            data = ev.detail.data;
        }
        console.log({data})
        // We get the trigger here
        const targetQuery = new ElementQuery(this.getAttribute("to"));
        const targetElement = targetQuery.searchElement(this);
        if (!targetElement) {
            return;
        }

        switch (targetQuery.propertyType) {
            case "method":
                // For method call
                console.log("target method", targetQuery.propertyName)
                if (targetElement[targetQuery.propertyName]) {
                    console.log("lo tiene")
                    targetElement[targetQuery.propertyName](data)
                }
                break;
            default:
                console.error(`[${targetQuery.propertyType}] method under development`)
        }

    }

}
