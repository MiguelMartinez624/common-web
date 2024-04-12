import {Server} from "../server";
import {generateAttributesInterpolations, generateTemplateInterpolations, Interpolation} from "./index";


export class InterpolationServer implements Server {
    public interpolations: Map<string, Interpolation[]> = new Map<string, Interpolation[]>();
    private _root: any;


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
