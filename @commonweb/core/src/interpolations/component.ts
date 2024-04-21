import {IComponent} from "../IComponent";
import {generateAttributesInterpolations, generateTemplateInterpolations, Interpolation} from "./index";


export class InterpolationServer implements IComponent {
    public interpolations: Map<string, Interpolation[]> = new Map<string, Interpolation[]>();
    private _root: any;


    /**
     * onInit Need to create transformers from the templates and clear up those markdowns
     * host stand for the component itself (this) and then it comes the property and any key
     * <div>{{@host.property.key}}</div>
     *
     * Same as before but here we can use a [CSSSelector] to show other elements properties custom or
     * native properties
     * <div>{{[CSSSelector].property.key}}</div>
     */
    onInit(): void {

        const root = this._root;
        const childrens = root.shadowRoot ? [...root?.shadowRoot?.children, ...root.children] : [...root.children];
        // Bind Attribute Interpolations
        // childs should be the parameter
        generateAttributesInterpolations(root, childrens, this.interpolations);

        generateTemplateInterpolations(root, childrens, this.interpolations);
        this.onUpdate();
    }

    onUpdate(): void {
        // console.log("updater", this.interpolations)

        const interpolations = this.interpolations;
        // if you didn't use the notation wont have this field set.
        if (interpolations) {
            for (const [key, interpolationList] of interpolations) {
                interpolationList.forEach((interpolation: Interpolation) => interpolation.update())
            }
        }
    }

    setup(root: any): void {
        this._root = root;
    }

}
