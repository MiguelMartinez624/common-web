import {generateAttributesInterpolations} from "./attribute-interpolation";
import {generateTemplateInterpolations} from "./template-interpolation";

export * from './attribute-interpolation';
export * from './template-interpolation';


export interface Interpolation {
    update()
}


export class InterpolationServer {

    push(element){
        this.bindTemplateToProperties(element);
    }

    /**
     * Need to create transformers from the templates and clear up those markdowns
     * host stand for the component itself (this) and then it comes the property and any key
     * <div>{{@host.property.key}}</div>
     *
     * Same as before but here we can use a [CSSSelector] to show other elements properties custom or
     * native properties
     * <div>{{[CSSSelector].property.key}}</div>
     */
     bindTemplateToProperties(root: HTMLElement) {
         console.log(root)
        const interpolations = new Map<string, Interpolation[]>();
        const childrens = root.shadowRoot ? [...root?.shadowRoot?.children, ...root.children] : [...root.children];
        // Bind Attribute Interpolations
        // childs should be the parameter
        generateAttributesInterpolations(root, childrens, interpolations);

        generateTemplateInterpolations(root, childrens, interpolations);

        (root as any).interpolations = interpolations;

        const


    }

     checkInterpolationsFor(target: any, name) {
        const interpolations = target.interpolations;
        // if you didn't use the notation wont have this field set.
        if (interpolations) {
            const interpolationsList = interpolations.get(name);
            if (interpolationsList) {
                interpolationsList.forEach((interpolation: Interpolation) => interpolation.update())
            }
        }
    }

    // Run al interpolations
     checkAllInterpolations(target: any) {
        const interpolations = target.interpolations;
        // if you didn't use the notation wont have this field set.
        if (interpolations) {
            for (const [key, interpolationList] of interpolations) {
                interpolationList.forEach((interpolation: Interpolation) => interpolation.update())
            }
        }
    }
}