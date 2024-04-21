import {IComponent} from "../IComponent";
import {generateAttributesInterpolations, generateTemplateInterpolations, Interpolation} from "./index";


/**
 * @public
 * @class InterpolationComponent
 * @implements IComponent
 *
 * This class manages interpolation within a component, allowing dynamic updates based on data changes.
 * It supports interpolations within both attributes and templates.
 */
export class InterpolationComponent implements IComponent {
    /**
     * A map that stores interpolations for different keys.
     * The key is a string identifier, and the value is an array of `Interpolation` objects.
     */
    public interpolations: Map<string, Interpolation[]> = new Map<string, Interpolation[]>();

    /**
     * A private reference to the root element of the component.
     */
    private _root: any;

    /**
     * @public
     * @memberof InterpolationComponent
     * @description
     * This lifecycle hook is called after the component is initialized and its view is created.
     * It performs the following tasks:
     *  - Gathers child elements from both the shadow DOM (if present) and the main DOM.
     *  - Generates interpolations for attributes and templates within the child elements.
     *  - Calls `onUpdate` to trigger initial updates.
     */
    onInit(): void {
        const root = this._root;
        const childrens = root.shadowRoot
            ? [...root?.shadowRoot?.children, ...root.children]
            : [...root.children];

        // Bind Attribute Interpolations
        generateAttributesInterpolations(root, childrens, this.interpolations);

        generateTemplateInterpolations(root, childrens, this.interpolations);
        this.onUpdate();
    }

    /**
     * @public
     * @memberof InterpolationComponent
     * @description
     * This lifecycle hook is called whenever the component's data changes or other events trigger updates.
     * It iterates through the stored interpolations and calls the `update` method on each `Interpolation` object.
     */
    onUpdate(): void {
        const interpolations = this.interpolations;
        if (interpolations) {
            for (const [key, interpolationList] of interpolations) {
                interpolationList.forEach((interpolation: Interpolation) => interpolation.update());
            }
        }
    }

    /**
     * @public
     * @memberof InterpolationComponent
     * @description
     * This method is called during component initialization to set up the component's internal state.
     * It stores a reference to the component's root element.
     *
     * @param {any} root - The root element of the component.
     */
    setup(root: any): void {
        this._root = root;
    }
}
