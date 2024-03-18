import {Interpolation} from "./interpolations";
import {bindTemplateToProperties, isJSON} from "./web_components";


/**
 * @class FrameworkComponent
 * @extends HTMLElement
 *
 * Base class for creating custom components within the framework.
 */

export class FrameworkComponent extends HTMLElement {
    /**
     * A map of interpolations, mapping attribute names to lists of Interpolation instances.
     * @type {Map<string, Interpolation[]>}
     */
    public interpolations: Map<string, Interpolation[]> = new Map<string, Interpolation[]>();

    /**
     * An array of functions that represent the component's directives.
     * @type {Function[]}
     */
    public directives: Function[] = [];

    changeAttributeAndUpdate(attrName: string, newValue: any) {
        this.updateAttributes(attrName, newValue);
        this.checkInterpolationsFor(attrName);

        this.evaluateDirectives();

    }

    public evaluateDirectives(): void {
        if (!this.directives) {
            return
        }
        this.directives.forEach(d => d.call(this))
    }

    updateAttributes(name: string, newValue: any) {
        if ((this as any).attribute_list) {
            const handler = (this as any).attribute_list.get(name);
            if (!handler) {
                return;
            }
            const valueToPass = typeof newValue === 'string' && isJSON(newValue) ? JSON.parse(newValue) : newValue;
            // if the content is a object
            if (typeof handler === "function") {
                handler.apply(this, [valueToPass])
            } else {
                // in this case handler is the property name no a value actually
                // so we can index the property on the target
                this[handler] = valueToPass;
            }
        }
    }

    public checkInterpolations() {
        bindTemplateToProperties(this);
    }


    public checkInterpolationsFor(name) {
        const interpolations = this.interpolations;
        // if you didn't use the notation wont have this field set.
        if (interpolations) {
            const interpolationsList = interpolations.get(name);
            if (interpolationsList) {
                interpolationsList.forEach((interpolation: Interpolation) => interpolation.update())
            }
        }
    }

    // Run al interpolations
    public checkAllInterpolations() {
        const interpolations = this.interpolations;
        // if you didn't use the notation wont have this field set.
        if (interpolations) {
            for (const [key, interpolationList] of interpolations) {
                interpolationList.forEach((interpolation: Interpolation) => interpolation.update())
            }
        }
    }
}
