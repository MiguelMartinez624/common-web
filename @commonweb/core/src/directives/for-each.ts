import {extractData} from "../html_manipulation";


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

