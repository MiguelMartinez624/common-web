import {extractData, findAllChildrensBySelector} from "../html_manipulation";

export * from "./for-each";



export function enhanceClassChange() {
    findAllChildrensBySelector(this, "[toggle]")
        .forEach((child) => {
            if (!child["toggleClass"]) {
                child["toggleClass"] = (className: string) => {
                    child.classList.toggle(className);
                }
            }
        });
}

/*
   * checkShowIfDirective will evaluate the show-if directive and
   * */
export function checkShowIfDirective() {
    findAllChildrensBySelector(this, "[show-if]")
        .forEach((child) => {
            const value = extractData(child.getAttribute("show-if"), this.data);
            if (!value) {
                child.setAttribute("hidden", "automatic")
            }
        });
}
