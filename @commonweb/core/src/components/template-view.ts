import {bindTemplateToProperties, WebComponent} from "../web_components";
import {Attribute} from "../attributes";
import {callRemoteAPI} from "./api-call.component";

@WebComponent({
    selector: 'template-view',
    template: '<slot></slot>',
})
export class TemplateView extends HTMLElement {

    public externalTemplate = false;

    // componentName will be evaluated as first priority and if its not null
    // then a component will be created, data pass to it and injected into this
    // component parent
    @Attribute("data")
    public data: any | null;

    // componentName will be evaluated as first priority and if its not null
    // then a component will be created, data pass to it and injected into this
    // component parent
    public templateHTML: any;

    @Attribute("set-data")
    public setData(d: any) {
        this.data = d;
        // Manually calling check template interpolations as there was not attribute call
        // because we are passing the data via setter that doen't trigger the attributeChangeCallbacl
        if (!this.attributes.getNamedItem("for-each")) {
            this['checkInterpolationsFor']("data");
        }
    }


    // componentName will be evaluated as first priority and if its not null
    // then a component will be created, data pass to it and injected into this
    // component parent
    @Attribute("view")
    // probably no required as i already know my template inside
    public set view(newView: string) {
        this.querySelector("slot").innerHTML = newView
    }

    /*
    * use for pull template (html) remotely
    * */
    @Attribute("src")
    public set src(newSrc: string) {
        this.externalTemplate = true;
        callRemoteAPI(newSrc, "GET", {})
            .then((result) => {
                this.templateHTML = result;
                // check the view to create the interpolations
                if (!this.attributes.getNamedItem("for-each")) {
                    this.innerHTML = result;

                    bindTemplateToProperties(this);

                }
                // This shoul be taked by the global handler
                const event = new CustomEvent(
                    "lazyload-template", {detail: {emitter: this}});
                window.dispatchEvent(event);
                this.dispatchEvent(new CustomEvent("template-changed", {bubbles: true}))
            })
    }

    public setView(view: string) {
        this.dispatchEvent(new CustomEvent("template-changed", {bubbles: true}))
        this.view = view;
    }

    public static get observedAttributes(): string[] {
        return ["data", "view", "src"]
    }
}
