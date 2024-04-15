import {
    Attribute,
    FrameworkComponent,
    WebComponent
} from "@commonweb/core";
import {callRemoteAPI} from "./api-call.component";

/*
* Template that will pull its content from a remote source, like lazy loading style, will make a fetch
* and append its content as the innerHTML.
* */

@WebComponent({
    selector: 'static-template',
    template: '<slot></slot>',
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


/**
 *
 * LazyTemplate is a custom web component that allows you to dynamically load and render templates based on data or a provided URL.
 * It utilizes the static-template component to handle the actual template rendering and interpolation.
 *
 *  <lazy-template data="{{ myData }}">
 *  </lazy-template>
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
            // This code checks and updates the template even if the "data" attribute is set after the template
            // is rendered.
            //
            // 1. **`checkAllInterpolations`:** This is called because the `for-each` loop might not be filled with data yet
            //    (when data comes after the template). This ensures any existing interpolations without data are
            //    handled correctly.
            // 2. **`evaluateDirectives`:** After ensuring interpolations are handled, this call evaluates all directives
            //    within the template, ensuring they are updated with the newly provided data.

            // **Context:**
            //
            // This logic is relevant when the data arrives after the template has been rendered.
            // In this scenario, the `connectedCallback` wouldn't be triggered, potentially leaving the template outdated.
            template.checkAllInterpolations()
            template.evaluateDirectives()
        }
    }

    public get data(): any {
        return this._data;
    }

    @Attribute("src")
    public set src(newSrc: string) {
        callRemoteAPI(newSrc, "GET", {})
            .then((result) => {
                const templateView = document.createElement("static-template") as StaticTemplate;
                templateView.innerHTML = result;
                templateView.data = this.data;
                this.appendChild(templateView);

                // should flag this script run?
                templateView.querySelectorAll("script").forEach((s) => {
                    const scriptNew = document.createElement("script");
                    scriptNew.textContent = s.textContent;
                    if (s.src) {
                        scriptNew.src = s.src;
                    }

                    document.head.appendChild(scriptNew);
                });


            })
    }

    public static get observedAttributes(): string[] {
        return ["data", "src"]
    }
}
