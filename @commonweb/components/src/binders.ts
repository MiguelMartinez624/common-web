import {Attribute, extractData, isJSON, WebComponent, ElementBind} from "@commonweb/core";


// TODO change the binding to set the target and starter affect target should
// trigger the bind, this should be change to bind-event probablly
// as is a reactive element that only owrk with evetns

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
        return ["from", "to", "value"];
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

        const triggerQuery = new ElementBind(this, fromSelector);
        const triggerElement: any = triggerQuery.searchElement();
        if (!triggerElement) {
            console.warn("not foound")
            return;
        }
        switch (triggerQuery.propertyType) {
            case "event":
                triggerElement.addEventListener(triggerQuery.propertyName, this.affectTarget.bind(this));
                break
            default:
                console.error(`[${triggerQuery.propertyType}] trigger method under development`)
        }
        this.binded = true;
    }

    // Refactor this affection code
    private affectTarget(ev: CustomEvent): void {
        // We get the trigger here
        const targetQuery = new ElementBind(this, this.getAttribute("to"));
        const targetElement = targetQuery.searchElement() as HTMLElement;
        if (!targetElement) {
            return;
        }

        const data = this.getPayload(ev)
        const field = targetElement[targetQuery.propertyName];

        switch (targetQuery.propertyType) {
            case "method":
                // For method call
                targetElement[targetQuery.propertyName](data)
                break;
            case "attribute":
                // check foe setter
                // TODO see how to remove this stringify
                typeof field === "function" ? targetElement[targetQuery.propertyName] = data : targetElement.setAttribute(targetQuery.propertyName, JSON.stringify(data));
                break;
            default:
                console.error(`[${targetQuery.propertyType}] method under development`)
        }

    }

    private getPayload(ev: CustomEvent) {
        if (this.getAttribute("value")) {
            const value = this.getAttribute("value");
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                return value;
            } else if (isJSON(value)) {
                return JSON.parse(value);
            }
        }

        if (this.getAttribute("input-src")) {
            // From other element
            const sourceInputQuery = new ElementBind(this, this.getAttribute("input-src"));
            const elementSource = sourceInputQuery.searchElement();
            if (!elementSource) {
                return;
            }

            const field = elementSource[sourceInputQuery.propertyName]
            return typeof field === 'function' ? field() : field;

        }
        // get the value from the event
        if (this.getAttribute("input-path")) {
            return extractData(this.getAttribute("input-path"), ev);
        }
        // Default path from CustomEvents
        if (ev.detail) {
            return ev.detail.data;
        }
    }
}
