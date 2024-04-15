import {IComponent} from "../IComponent";
import {findAllChildrensBySelector} from "../html_manipulation";
import {interpolateAndRender} from "./for-each";
import {ElementBind} from "../bindings";

export class LooperComponent implements IComponent {
    private _root: any;
    private loopers: any[] = [];

    onInit(): void {
        // on init
        findAllChildrensBySelector(this._root, "[for-each]")
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

    onUpdate(): void {
        this.loopers.forEach((looper) => {
            const key = looper.getAttribute("for-each")
                .replace("{{", "")
                .replace("}}", "");

            const elementBind = new ElementBind(looper, key);
            elementBind.searchElement();
            // Need to find the element so to dhat we will do this
            looper.clearAndPush(elementBind.value);
        })

    }

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

