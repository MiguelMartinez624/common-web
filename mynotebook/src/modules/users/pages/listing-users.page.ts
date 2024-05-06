import {WebComponent} from "@commonweb/core";
import {BUTTON_STYLE} from "../../../ui/styles";

@WebComponent({
    selector: `listing-users-page`,
    //language=HTML
    template: `
        <div>
            <h2>Users List</h2>
        </div>

        <div style="display: flex;width: 100%">
            <div style="flex:1">
                <div style="display: flex;align-items: center;justify-content: space-between">
                    <form-field label=" " placeholder="Search..."></form-field>
                    <button class="btn mobile">
                        <span style="font-size:30px;font-weight: 300">+</span>
                        <bind-element from="@parent:(click)" to="floating-content:toggle">
                        </bind-element>
                    </button>
                </div>
                <div class="list">
                    <profile-card></profile-card>
                </div>
            </div>
<!--            <div style="flex: 1">-->
<!--                <profile-details profile-id="test">-->

<!--                </profile-details>-->
<!--            </div>-->
        </div>
    `,
    //language=CSS
    style: `
        .line{
            height: 100%;
            width: 1px;
        }
        .list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 350px));
            grid-gap: 1rem;
            /*background: #28324c;*/
            padding: 5px;
            overflow-y: auto;
            height: 90%;
        }

        ${BUTTON_STYLE}
    `
})
export class ListingUsersPage extends HTMLElement {
}
