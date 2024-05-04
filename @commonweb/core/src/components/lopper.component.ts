import {IComponent} from "../IComponent";
import {extractData, findAllChildrensBySelector} from "../html_manipulation";
import {ElementBind} from "../bindings";

export const FOR_EACH_DIRECTIVE = "for-each";


// This actions to create a tempalte infly and anilize a tempalte
export function interpolateAndRender(loopInitialzier: HTMLTemplateElement, value: any, recipient: HTMLElement): HTMLElement {
    // Create the template to apply interpolation

    const templateView = (loopInitialzier.content.cloneNode(true) as any).children[0];
    recipient.appendChild(templateView);
    const identifier = extractData(loopInitialzier.getAttribute("loop-key") || "", value);
    templateView.setAttribute("loop-id", identifier);
    templateView.data = value;
    // avoid duplicates by key?
    (templateView as any).update();

    return templateView

}


/**
 * @public
 * @class LooperComponent
 * @implements IComponent
 *
 * This class manages loop elements within a component, allowing for dynamic rendering of data lists.
 * It supports functionalities like adding, removing, replacing, and clearing items within the loop.
 */
export class LooperComponent implements IComponent {
    /**
     * @private
     * @type {any}
     *
     * A reference to the component's root element.
     */
    private _root: any;

    /**
     * @private
     * @type {any[]}
     *
     * An array that stores references to all the loop elements found within the component.
     */
    private loopers: any[] = [];

    /**
     * @public
     * @memberof LooperComponent
     * @description
     * This lifecycle hook is called after the component is initialized and its view is created.
     * It performs the following tasks:
     *  - Finds all child elements with the `[for-each]` attribute using a helper function.
     *  - For each loop element:
     *      - Defines custom properties like `clearAndPush`, `push`, `removeItem`, `replace`, and `_loopElement`.
     *      - Stores the loop element in the `loopers` array.
     *  - Calls `onUpdate` to trigger initial rendering of loop elements.
     */
    onInit(): void {
        findAllChildrensBySelector(this._root, "[for-each]") // Assuming this helper function exists
            .forEach((looper) => {
                Object.defineProperty(looper, "clearAndPush", {
                    value: clearAndPush,
                    writable: false,
                    enumerable: true
                });

                Object.defineProperty(looper, "push", {
                    value: push,
                    writable: false,
                    enumerable: true
                });

                Object.defineProperty(looper, "removeItem", {
                    value: removeItem,
                    writable: false,
                    enumerable: true
                });

                Object.defineProperty(looper, "replace", {
                    value: replaceItem,
                    writable: false,
                    enumerable: true
                });

                Object.defineProperty(looper, "_loopElement", {
                    value: [],
                    writable: true,
                    enumerable: true
                });

                this.loopers.push(looper);
            });
        this.onUpdate();
    }

    /**
     * @public
     * @memberof LooperComponent
     * @description
     * This lifecycle hook is called whenever the component's data changes or other events trigger updates.
     * It iterates through the stored `loopers` and performs the following for each loop element:
     *  - Extracts the data key from the `for-each` attribute.
     *  - Creates an `ElementBind` instance to associate the loop element with the data key.
     *  - Calls the `searchElement` method on `ElementBind` to find the element template for rendering.
     *  - Calls the `clearAndPush` method on the loop element to render the data list based on the found template.
     */
    onUpdate(): void {
        this.loopers.forEach((looper) => {
            const key = looper.getAttribute("for-each")
                .replace("{{", "")
                .replace("}}", "");
            const elementBind = new ElementBind(looper, key);
            elementBind.searchElement();
            // Need to find the element so to dhat we will do this
            looper.clearAndPush(elementBind.value);
        });
    }

    /**
     * @public
     * @memberof LooperComponent
     * @description
     * This method is called during component initialization to set up the component's internal state.
     * It stores a reference to the component's root element.
     *
     * @param {any} target - The root element of the component.
     */
    setup(target: any): void {
        this._root = target;
    }
}


function clearAndPush(items: any[]) {
    if (!Array.isArray(items)) {
        console.log("no and array for for-each", {items})
        return;
    }
    // On a push all remove the previous elements so we can inject,
    // push all so each time , check if need to be replaced
    this._loopElement.forEach((e: HTMLElement) => e.remove());
    const recipient = this.parentElement;

    items.forEach((value) => {
        const t = interpolateAndRender(this, value, recipient);
        this._loopElement.push(t);
    });
}


function replaceItem(value: any) {

    const key = this.getAttribute("loop-key");

    const element = this._loopElement.find(ele => ele.getAttribute("loop-id") === value[key]);
    if (!element) {
        console.warn("dont exist", {key})
        return
    }

    // Como actualizar el elemento en el loop
    element.data = value;
    // element.innerHTML = element.innerHTML;
    element.changeAttributeAndUpdate("data", value)
    // Best way?

    element.firstElementChild.data = value;
    element.firstElementChild.checkAllInterpolations();
    element.firstElementChild.evaluateDirectives();

}

function removeItem(key: string) {
    const elementIndex = this._loopElement.findIndex(ele => ele.getAttribute("loop-id") === key);
    if (elementIndex === -1) {
        console.warn("dont exist", {key})
    }
    const element = this._loopElement[elementIndex];
    this._loopElement.splice(elementIndex, 1);
    element.remove();

}

function push(value: any) {
    const recipient = this.parentElement;
    const t = interpolateAndRender(this, value, recipient);
    this._loopElement.push(t);

}

