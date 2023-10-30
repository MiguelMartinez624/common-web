import {Attribute, WebComponent} from "@commonweb/core";
import {pushUrl} from "./router";
import {notifyRouteChange} from "./decorators";

@WebComponent({
    template: "<slot></slot>",
    selector: "go-route"
})
export class Route extends HTMLElement {
    public inserted = false;


    static get observedAttributes() {
        return ["component", "show", "route", "auth-required"];
    }

    private _componentName: string;

    public get isDefault(): boolean {
        const attr = this.getAttribute("default");
        return attr === "true" ? true : false;
    }

    public get authRequired(): boolean {
        const attr = this.getAttribute("auth-required");

        return attr === "true" ? true : false;
    }

    @Attribute("component")
    public componentName(componentName: string) {
        this._componentName = componentName;
    }

    @Attribute("show")
    public show(show: boolean) {

        if (show && this.authRequired) {
            // query login strategy
            // TODO should this be on the routing?
            if (!localStorage.getItem("user")) {
                pushUrl("login");
                return;
            }
        }
        if (show && !this.inserted) {
            if (this.children.length === 0) {
                this.appendChild(document.createElement(this._componentName));
                notifyRouteChange(this.getAttribute("route"), {mode: 'test'});
                this.inserted = true;
            }
        } else {
            const exist = this.querySelector(this._componentName);
            if (exist) {
                exist.remove();
                this.inserted = false;
            }
        }
    }

    public get routeSections(): string[] {
        return this.getAttribute("route").split("/") || [];
    }
}
