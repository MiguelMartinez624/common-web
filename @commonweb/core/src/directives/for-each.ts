import {bindTemplateToProperties} from "../web_components";
import {Template} from "../components";
import {extractData} from "../html_manipulation";


export const FOR_EACH_DIRECTIVE = "for-each";


// This actions to create a tempalte infly and anilize a tempalte
export function interpolateAndRender(loopInitialzier: HTMLElement, value: any, recipient: HTMLElement) {
    // Create the template to apply interpolation
    const templateView = document.createElement("static-template") as Template;
    templateView.innerHTML = loopInitialzier.innerHTML;
    templateView.data = value;
    const identifier = extractData(loopInitialzier.getAttribute("loop-key") || "", value);
    console.log({identifier, value, key: loopInitialzier.getAttribute("loop-key")})
    bindTemplateToProperties(templateView);
    templateView.setAttribute("loop-id", identifier);
    recipient.appendChild(templateView);
    return templateView

}


// TODO hacer el for each a partir de la data, con interpolacion? no
//
export function resolveLoop(looper: any) {

    // Donde se inyectaran
    const recipient = looper.parentElement;

    // Extending method to add pushAll
    if (!looper.getAttribute("loop-enhanced")) {
        looper["pushAll"] = pushAll;
        looper["push"] = push;

        looper.setAttribute("loop-enhanced", "done")
    }

    if (looper['for-each'] && Array.isArray(looper['for-each'])) {
        looper['pushAll'](looper['for-each'])
    }

}


function pushAll(items: any[]) {
    console.log({items, method: "pushAll"})
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