import {extractData, findAllChildrensBySelector, findNodeOnUpTree} from "../html_manipulation";
import {FrameworkComponent} from "../framework-component";
import {ElementBind} from "../bindings";


export const FOR_EACH_DIRECTIVE = "for-each";


// This actions to create a tempalte infly and anilize a tempalte
export function interpolateAndRender(loopInitialzier: HTMLElement, value: any, recipient: HTMLElement): HTMLElement {
    // Create the template to apply interpolation

    const templateView = document.createElement("static-template") as any;
    templateView.innerHTML = loopInitialzier.innerHTML;
    templateView.data = value;
    // avoid duplicates by key?

    const identifier = extractData(loopInitialzier.getAttribute("loop-key") || "", value);
    templateView.setAttribute("loop-id", identifier);
    recipient.appendChild(templateView);
    return templateView

}

export function resolveLoop(looper: any) {

    // Extending method to add pushAll
    if (!looper.getAttribute("loop-enhanced")) {

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


        looper._loopElement = [];
        looper.setAttribute("loop-enhanced", "done")
    }

    if (looper['for-each'] && Array.isArray(looper['for-each'])) {
        looper.clearAndPush(looper['for-each'])
    } else {
        // this part
        const key = looper.getAttribute("for-each")
            .replace("{{", "")
            .replace("}}", "");

        const elementBind = new ElementBind(looper, key);
        elementBind.searchElement();
        // Need to find the element so to dhat we will do this

        looper.clearAndPush(elementBind.value);

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


export function forEachDirective() {
    findAllChildrensBySelector(this, "[for-each]")
        .forEach(resolveLoop);
}
