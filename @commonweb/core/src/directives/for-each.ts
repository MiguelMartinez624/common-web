import {bindTemplateToProperties} from "../web_components";
import {Template} from "../components";


export const FOR_EACH_DIRECTIVE = "for-each";


// This actions to create a tempalte infly and anilize a tempalte
export function interpolateAndRender(loopInitialzier: HTMLElement, value: any, recipient: HTMLElement) {
    // Create the template to apply interpolation
    const templateView = document.createElement("static-template") as Template;
    templateView.innerHTML = loopInitialzier.innerHTML;
    templateView.data = value;
    bindTemplateToProperties(templateView);
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
        looper["pushAll"] = function (items: any[]) {
            if (!Array.isArray(items)) {
                return;
            }

            items.forEach((value) => {
                debugger
                const t = interpolateAndRender(looper, value, recipient);
                // check if in the nested tempalte there are more for-each to be handle
                t.querySelectorAll("[for-each]").forEach(resolveLoop)

            });
        }

        looper["push"] = function (value: any) {
            const t = interpolateAndRender(looper, value, recipient);
        }

        looper.setAttribute("loop-enhanced", "done")
    }

    if (looper['for-each'] && Array.isArray(looper['for-each'])) {
        looper['pushAll'](looper['for-each'])
    }

}
