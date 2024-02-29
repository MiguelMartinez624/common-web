import {Interpolation} from "./interpolations";
import {bindTemplateToProperties, isJSON} from "./web_components";

export class FrameworkComponent extends HTMLElement {

    public interpolations: Map<string, Interpolation[]> = new Map<string, Interpolation[]>();
    public directives: Function[] = [];

    /**
     * changeAttributeAndUpdate will call the update handler for the attribute you setup
     * that was attached under the @Attribute
     *
     * will manually trigger the check interpolation for the attribute name, as the HTMLElement attributeCallback
     * is only call on setAttribute method call
     * */
    changeAttributeAndUpdate(attrName: string, newValue: any) {
        this.updateAttributes(attrName, newValue);
        this.checkInterpolationsFor(attrName);

        this.evaluateDirectives();

    }

    public evaluateDirectives(): void {
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
