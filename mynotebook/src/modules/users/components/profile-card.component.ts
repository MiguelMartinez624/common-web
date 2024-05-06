import {WebComponent} from "@commonweb/core";
import {CARD_STYLE} from "../../../ui/styles";

@WebComponent({
    selector: `profile-card`,
    //language=HTML
    template: `
        <div class="card">
            <div>
                <img src="" alt="">
            </div>
            <div>
                <h4>Miguel Martinez</h4>
            </div>
        </div>
    `,
    //language=CSS
    style: `
        .card:hover {
            cursor: pointer;
            outline: 1px solid;
        }

        .card {
            display: flex;
            gap: 1rem;
        }

        ${CARD_STYLE}
        img {
            height: 60px;
            width: 60px;
            border-radius: 50%;
            background: lightgray;
        }
    `
})
export class ProfileCardComponent extends HTMLElement {
}
