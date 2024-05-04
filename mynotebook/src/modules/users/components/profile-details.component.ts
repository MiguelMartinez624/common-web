import {Attribute, WebComponent} from "@commonweb/core";
import {CARD_STYLE} from "../../../ui/styles";
import {ProfileID} from "../domain/profile";

@WebComponent({
    selector: `profile-details`,
    //language=HTML
    template: `
        <div class="card flex">
            <div>
                <img src="" alt="">
            </div>
            <div>
                <h2>Miguel Martinez</h2>
            </div>
        </div>
        <!-- make this a component from medical        -->
        <div style="display: flex">
            <div style="flex:0.5">
                <div style="border-bottom: 0.5px solid">
                    <h3>Medical History</h3>
                </div>
                <div>
                    <medical-record-item></medical-record-item>

                    <medical-record-item></medical-record-item>

                    <medical-record-item></medical-record-item>
                </div>
            </div>
        </div>
    `,
    //language=CSS
    style: `
        .flex {
            display: flex;
            gap: 1.5rem;
        }

        .card {

            margin: 15px 10px;

        }

        ${CARD_STYLE}
        img {
            height: 90px;
            width: 90px;
            border-radius: 50%;
            background: lightgray;
        }
    `
})
export class ProfileDetailsComponent extends HTMLElement {
    @Attribute("profile-id")
    public setProfileId(profileId: ProfileID) {
        console.log({profileId})
        // do fetch for attributes
    }


    static get observedAttributes(): string[] {
        return ["profile-id"]
    }
}


@WebComponent({
    selector: `medical-record-item`,
    //language=HTML
    template: `

        <!-- List for all appointments that had with the doctor-->
        <div class="card" style="display: flex;gap: 1rem;">
            <div>
                <!--Date-->
                <span style="font-size: large;font-weight: 400;">20/02/2024</span>
            </div>
            <div>
                <!--Brief discription-->
                <span style="font-weight: lighter">Chequeo Rutina</span>
            </div>
            <div>
                <!--Tests-->
            </div>
        </div>
    `,
    //language=CSS
    style: `
        ${CARD_STYLE}
        .card {
            padding: 1rem;
            margin: 15px 0px;
            cursor: pointer;
        }

        .card:hover {
            cursor: pointer;
            outline: 1px solid;
        }
    `
})
export class MedicalRecordItemComponent extends HTMLElement {

}
