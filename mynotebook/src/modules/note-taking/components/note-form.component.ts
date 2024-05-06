import {QueryElement, QueryResult, WebComponent} from "@commonweb/core";
import {FormGroup, TextareaField} from "@commonweb/forms";
import {BUTTON_STYLE, CARD_STYLE} from "../../../ui/styles";
import {Note} from "../domain";

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
                                placeholder="un dunlanden" rows="20"
                                label="Content">
                </textarea-field>
            </form-group>
            
            <div style="display: flex;justify-content: end;padding: 0 11px;gap:1rem">
                <button class="btn">Preview
                    <bind-element input-path="detail.data"
                                  from="@parent:(click)"
                                  to="@host:preview"></bind-element>
                </button>
                <button  submit class="btn">Submit
                    <bind-element
                            from="[submit]:(click)"
                            to="@host:submit"></bind-element>
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
        .card{
            height: 100%;
        }
        ${CARD_STYLE}
        ${BUTTON_STYLE}
    `
})
export class NoteFormComponent extends HTMLElement {

    @QueryElement("form-group")
    public formGroup: QueryResult<FormGroup>;

    public submit() {
        const form = this.formGroup.unwrap();
        const data = form.getValue();
        this.dispatchEvent(new CustomEvent("submit", {detail: data}));
        form.reset();
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
        const form = this.formGroup.unwrap();
        form.setValue(note);
    }


    getValue() {
        const form = this.formGroup.unwrap();
        form.getValue();
    }

    public preview() {
        const data = this.formGroup.unwrap().getValue();
        console.log({data})
        this.dispatchEvent(new CustomEvent("preview", {detail: data}));
    }


}
