import {WebComponent} from "@commonweb/core";
import {CARD_STYLE} from "../expenses/styles";
import {ExpensesContext} from "../expenses";
import {Stream} from "../expenses/models";
import {NotesContext} from "./notes-context";
import {NewNoteRequest, Note} from "./models";
import {Observer} from "../core";
import {TextareaField} from "@commonweb/forms";

@WebComponent({
    selector: "notes-page",
    // language=HTML
    template: `
        <div class="page">
            <div style="display: flex;justify-content: space-between;align-items: center">
                <span class="y-center">    <h4>Notes</h4></span>
                <notes-context></notes-context>
                <!-- actions                -->
                <div class="y-center">
                    <button class="btn">
                        <bind-element from="@parent:(click)" to="@host:download">
                        </bind-element>
                        <div class="y-center">
                            <cw-download-icon></cw-download-icon>
                            Download
                        </div>

                    </button>
                    <button class="btn">
                        <span style="font-size:30px;font-weight: 300">+</span>
                        <bind-element from="@parent:(click)" to="floating-content:toggle">
                        </bind-element>
                    </button>
                </div>

            </div>


            <div style="overflow: auto;height:85vh;position: relative">
                <template stream-list for-each="notes-context:getAllNotes">
                    <note-card data="{{@host:[data]}}"></note-card>
                </template>
            </div>

        </div>


        <div class="desktop" style="flex:1">
            <form-group>
                <form-field
                        property="title"
                        placeholder="Nombre de nota" label="Title"></form-field>
                <textarea-field property="content" placeholder="un dunlanden" rows="38"
                                label="Content"></textarea-field>

            </form-group>
            <div style="display: flex;justify-content: end;padding: 0 11px;gap:1rem">
                <button submit class="btn">Submit
                    <bind-element input-path="detail.data" from="form-group:(submit)"
                                  to="@host:submit"></bind-element>
                    <bind-element from="form-group:(submit)"
                                  to="form-group:reset"></bind-element>
                    <bind-element from="button[submit]:(click)" to="form-group:submit"></bind-element>
                    <bind-element from="form-group:(submit)" to="floating-content:toggle"></bind-element>
                </button>
                <button class="btn ">
                    <cw-speech-recognition>
                    </cw-speech-recognition>
                </button>
            </div>
        </div>

        <div class="mobile">
            <floating-content>
                <div class="card" slot="content" form>

                    <form-group>
                        <form-field
                                property="title"
                                placeholder="Nombre de nota" label="Title"></form-field>
                        <textarea-field mobile property="content" placeholder="un dunlanden" rows="38"
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
                            <bind-element from="form-group:(submit)" to="floating-content:toggle"></bind-element>
                        </button>
                        <button class="btn ">
                            <cw-speech-recognition>
                            </cw-speech-recognition>
                        </button>
                    </div>
                </div>
            </floating-content>

        </div>

    `,
    // language=CSS
    style: `



        :host {
            display: flex;
            gap: 1rem;
            height: 100%;
        }

        .page {
            flex-basis: 30vw;
            height: 100%;
        }

        .mobile {
            display: none;
        }

        .desktop {
            display: block;
        }

        @media (max-width: 800px) {
            :host {
                gap: 0;
            }

            .page {
                max-width: 100%;
                width: 100%;
                flex-basis: 100%;

            }

            .mobile {
                display: block;
            }

            .desktop {
                display: none;
            }
        }

        .btn {
            padding: 0 15px;
            height: 44px;
            display: flex;
            background: none;
            color: var(--content-fg);
            align-items: center;
            border: 1px solid cyan;
            border-radius: 6px;
        }

        cw-download-icon {
            height: 22px;
            width: 15px;
        }

        .y-center {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .income {
            color: lightgreen;
        }

        .outcome {
            color: lightcoral;
        }

        .stream-summary {
            display: flex;
            justify-content: space-between;
            border-bottom: 0.5px solid var(--card-fc);
            padding: 10px 0px;
            font-weight: bold;
        }

        ${CARD_STYLE}
    `
})
export class NotesListingPage extends HTMLElement {
    public streamSummary: { available: string; pending: string; debt: string };



    public onAddedNoteObserver: Observer<Note> = (note: Note): void => {
        const element = (this as any);
        element.query()
            .where("[stream-list]")
            .then((list: any) => {
                list.push(note);
                element.update();
            })
            .catch(console.error)
            .build()
            .execute();
    }

    // Temporal to allow saving real data while development is on early
    download() {
        const element = (this as unknown as any);
        element
            .query()
            .where("notes-context")
            .then((ctx: NotesContext) => {
                // hack for downlaod file
                const streams = ctx.getAllNotes();
                const filename = `notes-${new Date().toLocaleDateString()}.json`
                const content = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(streams))}`;
                const link = document.createElement('a');
                link.setAttribute('href', content);
                link.setAttribute('download', filename);
                link.click();
            })
            .catch(console.error)
            .build()
            .execute();
    }

    public submit(data: { title: string, content: string }) {

        const element = (this as unknown as any);

        element
            .query()
            .where("notes-context")
            .then((ctx: NotesContext) => {
                ctx.addNewNote(new NewNoteRequest(data.title, data.content));
            })
            .catch(console.error)
            .build()
            .execute();

    }

    connectedCallback() {

        const element = (this as unknown as any);

        element
            .query()
            .where("notes-context")
            .then((ctx: NotesContext) => {

                ctx.onAppendNoteObservable.subscribe(this.onAddedNoteObserver)
            })
            .catch(console.error)
            .build()
            .execute();


        element
            .query()
            .where("cw-speech-recognition")
            .then((child: HTMLElement) => {
                child.addEventListener("speech-ended", (ev: CustomEvent) => {
                    const transcription = ev.detail.final_transcript;

                    element
                        .query()
                        .where("textarea-field[mobile]")
                        .then((textarea: TextareaField) => {

                            textarea.setValue(textarea.value() + " \n" + transcription + ".");

                        })
                        .catch(console.error)
                        .build()
                        .execute();


                    console.log(ev)
                })
            })
            .catch(console.error)
            .build()
            .execute();


    }


}
