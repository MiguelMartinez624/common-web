import {WebComponent} from "@commonweb/core";

@WebComponent({
    selector: "tt-button",
    template: '<button><slot></slot></button>',
    style: `button {
              width: 100%;
              font-size:large;
              font-weight:bold;
              background-color:  var(--btn-primary-bg,#4CAF50);
              color: var(--btn-primary-color,white);
              padding: 14px 20px;
              margin: 0px 0;
              border: none;
              border-radius:var(--btn-radius,5px);
              cursor: pointer;
            }`
})
export class Button extends HTMLElement {

}