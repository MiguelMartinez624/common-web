import {Attribute, WebComponent} from "@commonweb/core";
import {FormGroup, TextareaField} from "@commonweb/forms";
import {BUTTON_STYLE, CARD_STYLE} from "../../../ui/styles";
import {Note} from "../domain";

@WebComponent({
    selector: `notes-preview`,
    // language=HTML
    template: `
        <div class="card">
            <h4>
                {{@host:[_note.title]}}
            </h4>
            <section>
                {{@host:[_note.content]}}
            </section>

        </div>
    `,
    //language=CSS
    style: `
        .card {
            height: 100%;
        }

        ${CARD_STYLE}
        ${BUTTON_STYLE}
    `
})
export class NotePreviewComponent extends HTMLElement {
    private _note: { title: string; content: string } = {title: " ", content: " "};

    @Attribute("note")
    public set note(d: { title: string, content: string }) {
        this._note = d;
    }

    static get observedAttributes():string[]{
        return ["note"]
    }
}
