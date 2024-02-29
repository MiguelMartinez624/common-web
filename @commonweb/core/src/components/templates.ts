import {bindTemplateToProperties, FrameworkComponent, WebComponent} from "../web_components";
import {Attribute} from "../attributes";
import {callRemoteAPI} from "./api-call.component";
import {extractData} from "../html_manipulation";
import {resolveLoop} from "../directives";


function forEachDirective() {
    const onShadow = this.shadowRoot ? this.shadowRoot.querySelectorAll("[for-each]") : [];
    [...this.querySelectorAll("[for-each]"), ...onShadow]
        .forEach((childWithLoop) => {
            resolveLoop(childWithLoop)
        })
}

function enhanceClassChange() {
    const onShadow = this.shadowRoot ? this.shadowRoot.querySelectorAll("[for-each]") : [];

    [...this.querySelectorAll("[toggle]"), ...onShadow]
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
function checkShowIfDirective() {
    const onShadow = this.shadowRoot ? this.shadowRoot.querySelectorAll("[for-each]") : [];

    [...this.querySelectorAll("[show-if]"), ...onShadow]
        .forEach((child) => {
            const value = extractData(child.getAttribute("show-if"), this.data);
            if (!value) {
                child.setAttribute("hidden", "automatic")
            }
        });
}


/*
* Template that will pull its content from a remote source, like lazy loading style, will make a fetch
* and append its content as the innerHTML.
* */
@WebComponent({
    selector: 'static-template',
    template: '<slot></slot>',
    directives: [forEachDirective, enhanceClassChange, checkShowIfDirective]
})
export class StaticTemplate extends FrameworkComponent {

    // local reference/cache for the input
    protected _data: any;
    // componentName will be evaluated as first priority and if its not null
    // then a component will be created, data pass to it and injected into this
    // component parent


    @Attribute("data")
    public set data(data) {
        this._data = data;
    }

    public get data(): any {
        return this._data;
    }

    public static get observedAttributes(): string[] {
        return ["data"]
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
export class LazyTemplate extends FrameworkComponent {
    private _data: any;


    @Attribute("data")
    public set data(data) {
        this._data = data;
        const template = this.querySelector("static-template") as StaticTemplate;
        if (template) {
            template.data = data;
            // Run the cbeck as for-each is not filled with data yet
            // and afet evaluatin that proceed to make evaluate the directive
            // once the data have  been set for the for-each loop, and this is for the case where the data
            // came after the tempalte, so the connected Callback wasent triggered
            template.checkAllInterpolations()
            template.evaluateDirectives()
        }
    }

    public get data(): any {
        return this._data;
    }

    /*
    * use for pull template (html) remotely
    * make specific tempalte
    * lazy-template
    * */
    @Attribute("src")
    public set src(newSrc: string) {

        callRemoteAPI(newSrc, "GET", {})
            .then((result) => {
                const templateView = document.createElement("static-template") as StaticTemplate;
                templateView.innerHTML = result;
                templateView.data = this.data;
                this.appendChild(templateView);
                templateView.evaluateDirectives()

            })
    }

    public static get observedAttributes(): string[] {
        return ["data", "src"]
    }
}
