import {TemplateView} from "../components";
import {bindTemplateToProperties} from "../web_components";


export const FOR_EACH_DIRECTIVE = "for-each";


// This actions to create a tempalte infly and anilize a tempalte
export function interpolateAndRender(loopInitialzier: any, value, recipient: HTMLElement) {
    const templateView = document.createElement("template-view") as TemplateView;
    templateView.innerHTML = loopInitialzier.templateHTML || loopInitialzier.innerHTML;
    templateView.data = value;
    bindTemplateToProperties(templateView);
    recipient.appendChild(templateView);
    return templateView

}

export function resolveLoop(loopInitialzier: any) {
    // Extending method to add pushAll
    if (!loopInitialzier["pushAll"]) {
        loopInitialzier["pushAll"] = function (items: any[]) {
            if (!Array.isArray(items)) {
                return;
            }
            items.forEach((value) => {
                const t = interpolateAndRender(loopInitialzier, value, recipient);
                // check if in the nested tempalte there are more for-each to be handle
                t.querySelectorAll("[for-each]").forEach(resolveLoop)

            });
        }
    }

    if (loopInitialzier['for-each'] !== undefined && !Array.isArray(loopInitialzier["for-each"])) {
        return;
    }

    const recipient = loopInitialzier.parentElement;
    loopInitialzier['for-each']?.forEach((value) => {
        const t = interpolateAndRender(loopInitialzier, value, recipient);
        // check if in the nested tempalte there are more for-each to be handle
        t.querySelectorAll("[for-each]").forEach(resolveLoop)

    });
}
