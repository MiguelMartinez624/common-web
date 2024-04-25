import {WebComponent} from "@commonweb/core";
import {CARD_STYLE} from "../expenses/styles";
import {NotesContext} from "./notes-context";
import {NoteChangesRequest, NewNoteRequest, Note} from "./models";
import {Observer} from "../core";
import {NoteFormComponent} from "./note-form.component";
import {BUTTON_STYLE} from "../../ui/styles";
import {FloatingContentComponent} from "../../layout";

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
                    <button class="btn mobile">
                        <span style="font-size:30px;font-weight: 300">+</span>
                        <bind-element from="@parent:(click)" to="floating-content:toggle">
                        </bind-element>
                    </button>
                </div>

            </div>


            <div style="overflow: auto;height:85vh;position: relative">
                <template stream-list  loop-key="id" for-each="notes-context:getAllNotes">
                    <note-card data="{{@host:[data]}}">
                        <bind-element
                                input-path="detail"
                                from="@parent:(remove-note)"
                                to="notes-page:removeNote">
                        </bind-element>
                        <bind-element
                                input-path="detail"
                                from="@parent:(note-selected)"
                                to="notes-pages:selectNote">
                        </bind-element>
                    </note-card>
                </template>
            </div>

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
            display: none
        }

        @media (max-width: 800px) {
            :host {
                gap: 0;
            }

            .mobile {
                display: block;
            }

            .page {
                max-width: 100%;
                width: 100%;
                flex-basis: 100%;
            }
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


        ${BUTTON_STYLE}
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
    };


    private notesContext: NotesContext;
    private selectedNote: Note | null = null;


    selectNote(note: Note) {
        this.selectedNote = note;
        const element = (this as unknown as any);
        element
            .query()
            .where("notes-form")
            .then((form: NoteFormComponent) => {
                form.setValue(note);

                // move to floating content if is a mobile
                if (window.innerWidth < 580) {
                    element.query().where("floating-content")
                        .then((content: FloatingContentComponent) => content.toggle())
                        .catch(console.error)
                        .build()
                        .execute();
                }
            })
            .catch(console.error)
            .build()
            .execute();
    }

    // Temporal to allow saving real data while development is on early
    download() {
        const streams = this.notesContext.getAllNotes();
        const filename = `notes-${new Date().toLocaleDateString()}.json`
        const content = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(streams))}`;
        const link = document.createElement('a');
        link.setAttribute('href', content);
        link.setAttribute('download', filename);
        link.click();
    }


    public submit(data: { title: string, content: string }) {
        const element = (this as unknown as any);

        if (!this.selectedNote) {
            this.notesContext.addNewNote(new NewNoteRequest(data.title, data.content));
        } else {
            this.notesContext.updateNote(new NoteChangesRequest(
                this.selectedNote.id,
                data.title,
                data.content,
                this.selectedNote.creationDate));
            if (window.innerWidth < 580) {
                element.query().where("floating-content")
                    .then((content: FloatingContentComponent) => content.toggle())
                    .catch(console.error)
                    .build()
                    .execute();
            }
        }

        this.selectedNote = null;

    }


    public removeNote(noteId: string) {
        this.notesContext.removeNote(noteId)
    }

    connectedCallback() {
        const element = (this as unknown as any);

        element
            .query()
            .where("notes-context")
            .then((ctx: NotesContext) => {
                this.notesContext = ctx;
                ctx.onAppendNoteObservable.subscribe(this.onAddedNoteObserver)

                ctx.onRemoveNoteObservable.subscribe((id)=>{
                    element.query()
                        .where("[stream-list]")
                        .then((list: any) => {
                            list.removeItem(id);

                        })
                        .catch(console.error)
                        .build()
                        .execute();
                })
            })
            .catch(console.error)
            .build()
            .execute();

        // Think on a better way to handle this?
        this.renderNotesForms();

    }


    private renderNotesForms() {
        if (window.innerWidth > 580) {
            this.shadowRoot.innerHTML += `
                 <div class="desktop" style="flex:1">
                        <notes-form>
                            <bind-element input-path="detail" from="@parent:(submit)" to="notes-page:submit"></bind-element>
                        </notes-form>
                 </div>`;
        } else {
            this.shadowRoot.innerHTML += `
                    <floating-content>
                            <notes-form slot="content">
                                <bind-element
                                 input-path="detail"
                                  from="@parent:(submit)"
                                   to="notes-page:submit"></bind-element>
                            </notes-form>
                    </floating-content>
            `;
        }
    }
}
