import { findAllChildrensBySelector} from "../html_manipulation";
import {ElementBind} from "../bindings";
import {LooperComponent} from "./server";

export * from "./for-each";


export function enhanceClassChange() {
    findAllChildrensBySelector(this, "[toggle]")
        .forEach((child) => {
            if (!child["toggleClass"]) {
                child["toggleClass"] = (className: string) => {
                    child.classList.toggle(className);
                }

                child["toggleUniqueClass"] = (className: string) => {
                    // in case there is a initial one marked as selected neeed to be marked
                    // as the current affected
                    if (!this._currentAffected) {
                        this._currentAffected = this.shadowRoot.querySelector("." + className) || this.querySelector("." + className);
                    }

                    if (this._currentAffected) {
                        this._currentAffected.classList.remove(className);
                        this._currentAffected = child;
                        child.classList.toggle(className);
                    } else {
                        this._currentAffected = child;
                        child.classList.toggle(className);

                    }
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

export function appendLoopServer(target: any) {
    if (target.servers === undefined) {
        target.servers = [new LooperComponent()];
    } else {
        target.servers.push(new LooperComponent());
    }
}
