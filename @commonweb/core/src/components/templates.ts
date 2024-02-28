import {bindTemplateToProperties, WebComponent} from "../web_components";
import {Attribute} from "../attributes";
import {callRemoteAPI} from "./api-call.component";
import {extractData} from "../html_manipulation";
import {resolveLoop} from "../directives";



export abstract class Template extends HTMLElement {

    // local reference/cache for the input
    protected _data: any;
    // componentName will be evaluated as first priority and if its not null
    // then a component will be created, data pass to it and injected into this
    // component parent
    @Attribute("data")
    public set data(data: any) {
        this._data = data;
        this.syncLoopsData();

    }

    public get data(): any {
        return this._data;
    }

    protected syncLoopsData() {
        [...this.querySelectorAll("[for-each]"), ...this.shadowRoot.querySelectorAll("[for-each]")]
            .forEach((childWithLoop) => {
                resolveLoop(childWithLoop)
            })
    }

    protected enhanceClassChange() {
        [...this.querySelectorAll("[toggle]"), ...this.shadowRoot.querySelectorAll("[toggle]")]
            .forEach((child) => {
                if (!child["toggleClass"]) {
                    child["toggleClass"] = (className: string) => {
                        child.classList.toggle(className);
                    }
                }
            });
    }

    /*
    * checkShowIfDirective will evaluate the show-if directive and
    * */
    protected checkShowIfDirective() {
        [...this.querySelectorAll("[show-if]"), ...this.shadowRoot.querySelectorAll("[show-if]")]
            .forEach((child) => {
                const value = extractData(child.getAttribute("show-if"), this.data);
                if (!value) {
                    child.setAttribute("hidden", "automatic")
                }
            });
    }
}

/*
* Template that will pull its content from a remote source, like lazy loading style, will make a fetch
* and append its content as the innerHTML.
* */
@WebComponent({
    selector: 'static-template',
    template: '<slot></slot>',
})
export class StaticTemplate extends Template {

    public updateData(data) {
        this.data = data;

        // Cada vez q se teo el data deberia revisar esto? no creeria yo
        // // Check before syncing so we have all the data
        this["checkAllInterpolations"]();

        // Do on init or when change?

        // // Enhansament for the content
        this.syncLoopsData();
        this.enhanceClassChange();
        this.checkShowIfDirective();
    }

    public static get observedAttributes(): string[] {
        return ["data"]
    }

    connectedCallback() {

        // // Check before syncing so we have all the data
        this["checkAllInterpolations"]();

        // Do on init or when change?

        // // Enhansament for the content
        this.syncLoopsData();
        this.enhanceClassChange();

    }

}

/*
* Template that will pull its content from a remote source, like lazy loading style, will make a fetch
* and append its content as the innerHTML.
* */
@WebComponent({
    selector: 'lazy-template',
    template: '<slot></slot>',
})
export class LazyTemplate extends Template {

    /*
    * use for pull template (html) remotely
    * make specific tempalte
    * lazy-template
    * */
    @Attribute("src")
    public set src(newSrc: string) {

        callRemoteAPI(newSrc, "GET", {})
            .then((result) => {
                // check the view to create the interpolations
                this.innerHTML = result;
                bindTemplateToProperties(this);
                // Check before syncing so we have all the data
                this["checkAllInterpolations"]();

                // Enhansament for the content
                this.syncLoopsData();
                this.enhanceClassChange();
                this.checkShowIfDirective();


            })
    }

    public static get observedAttributes(): string[] {
        return ["data", "src"]
    }
}
