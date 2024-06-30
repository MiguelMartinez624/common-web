import {WebComponent} from "@commonweb/core";
import {BUTTON_STYLE, CARD_STYLE} from "../../../ui/styles";

@WebComponent({
    selector: "login-page",
    // language=HTML
    template: `
        <login-form></login-form>
    `,
    // language=CSS
    style: `
        ${BUTTON_STYLE}
        ${CARD_STYLE}
    `
})
export class LoginPage extends HTMLElement{}