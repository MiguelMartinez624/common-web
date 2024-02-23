import {bindTemplateToProperties, WebComponent} from "../web_components";
import {Attribute} from "../attributes";
import {callRemoteAPI} from "./api-call.component";
import {extractData} from "../html_manipulation";

@WebComponent({
    selector: 'template-view',
    template: '<slot></slot>',
})
export class TemplateView extends HTMLElement {
    private _data: any;
    private _show: any;

    public get show() {
        return this._show;
    }


    @Attribute("show")
    public set show(v: any) {
        this._show = v;
    }

    public externalTemplate = false;

    // componentName will be evaluated as first priority and if its not null
    // then a component will be created, data pass to it and injected into this
    // component parent
    @Attribute("data")
    public set data(data: any) {
        this['checkInterpolationsFor']("show");
        this._data = data;
    }

    public get data(): any {
        return this._data;
    }

    // componentName will be evaluated as first priority and if its not null
    // then a component will be created, data pass to it and injected into this
    // component parent
    public templateHTML: any;
    private _src: string;

    @Attribute("set-data")
    public setData(d: any) {
        this.data = d;
        // Manually calling check template interpolations as there was not attribute call
        // because we are passing the data via setter that doen't trigger the attributeChangeCallbacl
        if (!this.attributes.getNamedItem("for-each")) {
            this['checkInterpolationsFor']("show");
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
        if (newSrc === this._src) {
            return;
        }

        this._src = newSrc;
        this.externalTemplate = true;
        callRemoteAPI(newSrc, "GET", {})
            .then((result) => {
                this.templateHTML = result;
                // check the view to create the interpolations
                if (!this.attributes.getNamedItem("for-each")) {
                    this.innerHTML = result;
                    bindTemplateToProperties(this);
                    // See how preven the request to the template
                    // console.log(this.show)
                    if (this._show) {

                        const render = extractData(this._show, this.data);
                        if (!render) {
                            this.setAttribute("hidden", "true")
                        }
                    }

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
        return ["show", "data", "view", "src"]
    }
}
