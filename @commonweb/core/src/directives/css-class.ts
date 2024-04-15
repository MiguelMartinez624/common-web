import {IComponent} from "../IComponent";
import {findAllChildrensBySelector} from "../html_manipulation";
import {} from "./server";

export const CLASS_DIRECTIVE = "toggle";

export class CSSControllerComponent implements IComponent {
    private _currentAffected: HTMLElement | null = null;
    private _root: HTMLElement;

    onInit(): void {
        findAllChildrensBySelector(this._root, `[${CLASS_DIRECTIVE}]`)
            .forEach((child) => {
                if (!child["toggleClass"]) {
                    child["toggleClass"] = (className: string) => {
                        child.classList.toggle(className);
                    }

                    child["toggleUniqueClass"] = (className: string) => {
                        // in case there is a initial one marked as selected neeed to be marked
                        // as the current affected
                        if (!this._currentAffected) {
                            this._currentAffected = this._root.shadowRoot.querySelector("." + className) || this._root.querySelector("." + className);
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

    onUpdate(): void {
    }

    setup(target: any): void {
        this._root = target;
    }

}


export function appendCSSController(target: any) {
    if (target.servers === undefined) {
        target.servers = [new CSSControllerComponent()];
    } else {
        target.servers.push(new CSSControllerComponent());
    }
}
