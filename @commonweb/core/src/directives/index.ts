import {extractData, findAllChildrensBySelector} from "../html_manipulation";
import {ElementBind} from "../bindings";

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
            const path = child.getAttribute("show-if");
            const bind = new ElementBind(child, path);
            bind.searchElement();
            const value = bind.value;

            if (!value) {
                // Check check this as may lead to memory leeks, is not the best way
                // as is a reference to a element that was removed from the dom
                // see if persisting attributes to recreate the element later on is
                // a better option that this.
                this["cachedChild"] = child;
                child.remove();
            } else if (this["cachedChild"]) {
                console.log({value})

                const cached = this["cachedChild"].find(c => c === child);
                if (cached) {
                    this.appendChild(cached);
                }
            }
        });
}
