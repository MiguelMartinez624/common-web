import {IComponent} from "../IComponent";
import {findAllChildrensBySelector} from "../html_manipulation";

/**
 * @public
 * @constant {string} CLASS_DIRECTIVE
 *
 * The directive name used to identify elements controlled by this component.
 */
export const CLASS_DIRECTIVE = "toggle";

/**
 * @public
 * @class CSSControllerComponent
 * @implements IComponent
 *
 * This class manages elements with the `toggle` directive, allowing them to control CSS classes dynamically.
 * It provides two methods:
 *  - `toggleClass`: Toggles a specified class on the element itself.
 *  - `toggleUniqueClass`: Toggles a specified class on the element, ensuring only one element has that class active at a time.
 */
export class CSSControllerComponent implements IComponent {
    /**
     * @private
     * @type {HTMLElement | null}
     *
     * A reference to the currently affected element (the one with the unique class applied).
     */
    private _currentAffected: HTMLElement | null = null;

    /**
     * @private
     * @type {HTMLElement}
     *
     * A reference to the component's root element.
     */
    private _root: HTMLElement;

    /**
     * @public
     * @memberof CSSControllerComponent
     * @description
     * This lifecycle hook is called after the component is initialized and its view is created.
     * It performs the following tasks:
     *  - Finds all child elements with the `[toggle]` attribute (equivalent to `[${CLASS_DIRECTIVE}]`).
     *  - For each element:
     *      - Checks if the `toggleClass` and `toggleUniqueClass` methods are already defined.
     *      - If not, defines them to handle toggling of CSS classes:
     *          - `toggleClass`: Toggles the specified class on the element.
     *          - `toggleUniqueClass`:
     *              - If no element currently has the unique class, sets this element as the affected one and toggles the class.
     *              - If another element has the unique class:
     *                  - Removes the class from the currently affected element.
     *                  - Sets this element as the affected one and toggles the class.
     */
    onInit(): void {
        findAllChildrensBySelector(this._root, `[${CLASS_DIRECTIVE}]`) // Assuming this helper function exists
            .forEach((child) => {
                if (!child["toggleClass"]) {
                    child["toggleClass"] = (className: string) => {
                        child.classList.toggle(className);
                    };

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
                    };
                }
            });
    }

    /**
     * @public
     * @memberof CSSControllerComponent
     * @description
     * This lifecycle hook is currently empty, as there's no logic required for updates within this component.
     */
    onUpdate(): void {
        // No update logic needed currently
        findAllChildrensBySelector(this._root, `[${CLASS_DIRECTIVE}]`) // Assuming this helper function exists
            .forEach((child) => {
                if (!child["toggleClass"]) {
                    child["toggleClass"] = (className: string) => {
                        child.classList.toggle(className);
                    };

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
                    };
                }
            });
    }

    /**
     * @public
     * @memberof CSSControllerComponent
     * @description
     * This method is called during component initialization to set up the component's internal state.
     * It stores a reference to the component's root element.
     *
     * @param {any} target - The root element of the component.
     */
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
