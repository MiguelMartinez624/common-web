import {WebComponent} from "../web_components";
import {Attribute} from "../attributes";
import {resolveLoop} from "../directives";
import {extractData} from "../html_manipulation";

@WebComponent({
    selector: `data-context`,
    template: `<slot></slot> `,

})
export class DataContext extends HTMLElement {

    public _ctx: any;

    public get state(): any {
        return this._ctx;
    }

    @Attribute("state")
    public set state(newState: any) {
        this._ctx = newState;
        // manually trigger required?
        this['checkInterpolationsFor']("state");
        // when state change modify all childrens data
        this.querySelectorAll("[for-each]").forEach((child) => {
            (child as any).pushAll(this._ctx)
        })
    }

    connectedCallback() {
        this.querySelectorAll("[for-each]").forEach((element) => {
            // enhance
            resolveLoop(element)

        })
    }
}
