import {WebComponent} from "@commonweb/core";
import {BUTTON_STYLE, CARD_STYLE} from "../../../ui/styles";

@WebComponent({
    selector: "login-form",
    // language=HTML
    template: `
        <form-group>
            <form-field
                    property="username"
                    placeholder="Username"
                    label="Username">
            </form-field>
            <form-field
                    property="password"
                    placeholder="Password"
                    label="Password">
            </form-field>
        </form-group>
    `,
    // language=CSS
    style: `
        ${BUTTON_STYLE}
        ${CARD_STYLE}
    `
})
export class LoginFormComponent extends HTMLElement{}