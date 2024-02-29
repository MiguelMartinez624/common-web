import {StaticTemplate} from "../components";
import {extractData, findAllChildrensBySelector} from "../html_manipulation";
import {FrameworkComponent} from "../framework-component";


export const FOR_EACH_DIRECTIVE = "for-each";


// This actions to create a tempalte infly and anilize a tempalte
export function interpolateAndRender(loopInitialzier: HTMLElement, value: any, recipient: HTMLElement): HTMLElement {
    // Create the template to apply interpolation
    const templateView = document.createElement("static-template") as StaticTemplate;
    templateView.innerHTML = loopInitialzier.innerHTML;
    templateView.data = value;
    const identifier = extractData(loopInitialzier.getAttribute("loop-key") || "", value);
    templateView.setAttribute("loop-id", identifier);
    recipient.appendChild(templateView);
    return templateView

}

export function resolveLoop(looper: any) {

    // Extending method to add pushAll
    if (!looper.getAttribute("loop-enhanced")) {
        looper["pushAll"] = pushAll;
        looper["push"] = push;
        looper.setAttribute("loop-enhanced", "done")
    }

    if (looper['for-each'] && Array.isArray(looper['for-each'])) {
        looper['pushAll'](looper['for-each'])
    } else {
        const key = looper.getAttribute("for-each")
            .replace("{{", "")
            .replace("}}", "");
        const host = looper.getRootNode() || looper.parentElement;
        if (host instanceof FrameworkComponent) {
            const data = extractData(key, host);
            looper['pushAll'](data);
        }
    }

}


function pushAll(items: any[]) {
    if (!Array.isArray(items)) {
        return;
    }
    const recipient = this.parentElement;
    items.forEach((value) => {
        const t = interpolateAndRender(this, value, recipient);
        // TODO
        //  this is to propagate context on each of the for-each so
        //  it refers to the previous data context
        t.querySelectorAll("[for-each]").forEach(resolveLoop)

    });
}

function push(value: any) {
    const recipient = this.parentElement;
    const t = interpolateAndRender(this, value, recipient);
}


export function forEachDirective() {
    findAllChildrensBySelector(this, "[for-each]")
        .forEach(resolveLoop)
}
