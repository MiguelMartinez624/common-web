import {Attribute, WebComponent} from "@commonweb/core";

@WebComponent({
    selector: "tt-icon",
    template: `
        <i class="material-symbols-outlined "></i>
    `,
    style: `
    i{font-size: inherit;}
    :host{ color:var(--font-primary,white);}
    span,svg {height:inherit;width:inherit;}`
})
export class Icon extends HTMLElement {


    static get observedAttributes() {
        return ["icon"];
    }

    @Attribute("icon")
    public icon(iconName: string) {
        this.shadowRoot
            .querySelector("i").innerHTML = iconName;
    }
}
