import {Attribute, WebComponent} from "@commonweb/core";

@WebComponent({
    selector: `pp-icon`,
    template: `
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
     <span class="material-icons md-24">{{@host.icon}}</span>
    `,
    style: ``
})
export class IconComponent extends HTMLElement {
    @Attribute("icon")
    public icon: string = "";


    static get observedAttributes() {
        return ["icon"];
    }
}