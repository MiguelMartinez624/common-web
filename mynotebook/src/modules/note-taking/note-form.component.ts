import {WebComponent} from "@commonweb/core";
import {FormGroup, TextareaField} from "@commonweb/forms";
import {NewNoteRequest, Note} from "./models";
import {BUTTON_STYLE, CARD_STYLE} from "../../ui/styles";

@WebComponent({
    selector: `notes-form`,
    // language=HTML
    template: `
        <div class="card">

            <form-group>
                <form-field
                        property="title"
                        placeholder="Nombre de nota"
                        label="Title">
                </form-field>
                <textarea-field property="content"
                                placeholder="un dunlanden" rows="38"
                                label="Content">
                </textarea-field>

            </form-group>
            <div style="display: flex;justify-content: end;padding: 0 11px;gap:1rem">
                <button submit class="btn">Submit
                    <bind-element input-path="detail.data" from="form-group:(submit)"
                                  to="@host:submit"></bind-element>
                    <bind-element from="form-group:(submit)"
                                  to="form-group:reset"></bind-element>
                    <bind-element from="button[submit]:(click)" to="form-group:submit"></bind-element>
                </button>
                <button class="btn ">
                    <cw-speech-recognition>
                    </cw-speech-recognition>
                </button>
            </div>
        </div>
    `,
    //language=CSS
    style: `
        ${CARD_STYLE}
        
        ${BUTTON_STYLE}
    `
})
export class NoteFormComponent extends HTMLElement {

    public submit(data: { title: string, content: string }) {
        this.dispatchEvent(new CustomEvent("submit", {detail: data}));
    }

    connectedCallback() {
        const element = (this as any);

        element
            .query()
            .where("cw-speech-recognition")
            .then((child: HTMLElement) => {
                child.addEventListener("speech-ended", (ev: CustomEvent) => {
                    const transcription = ev.detail.final_transcript;

                    element
                        .query()
                        .where("textarea-field")
                        .then((textarea: TextareaField) => {

                            textarea.setValue(textarea.value() + " \n" + transcription + ".");

                        })
                        .catch(console.error)
                        .build()
                        .execute();
                });
            })
            .catch(console.error)
            .build()
            .execute();
    }

    setValue(note: Note) {
        const element = (this as any);

        element
            .query()
            .where("form-group")
            .then((form: FormGroup) => {
                form.setValue(note);

            })
            .catch(console.error)
            .build()
            .execute();
    }
}
