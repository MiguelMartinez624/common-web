import {QueryElement, QueryResult, WebComponent} from "@commonweb/core";
import {Observer} from "../../core";
import {NewNoteRequest, Note, NoteChangesRequest} from "../domain";
import {FloatingContentComponent} from "../../../layout";
import {NoteFormComponent, NotesContext} from "../components";
import {BUTTON_STYLE, CARD_STYLE} from "../../../ui/styles";

@WebComponent({
    selector: "notes-listing-page",
    // language=HTML
    template: `
        <div>
            <h2>Notes</h2>
        </div>

        <div style="display: flex;width: 100%">
            <div style="width: 100%;height: 78vh">
                <notes-context></notes-context>
                <div style="display: flex;align-items: center;justify-content: space-between">
                    <form-field label=" " placeholder="Search..."></form-field>
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
                            <bind-element from="@parent:(click)" to="@host:goToForm">
                            </bind-element>
                        </button>
                    </div>
                </div>
                <div class="list">
                    <template stream-list loop-key="id" for-each="notes-context:getAllNotes">
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
        </div>
    `,
    // language=CSS
    style: `
        .list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            grid-gap: 1rem;
            padding: 5px;
            overflow-y: auto;
            height: 90%;
            grid-template-rows: max-content;
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

    @QueryElement("notes-context")
    private notesContext: QueryResult<NotesContext>;

    @QueryElement("[stream-list]")
    private streamList: QueryResult<any>;

    public streamSummary: { available: string; pending: string; debt: string };

    public onAddedNoteObserver: Observer<Note> = (note: Note): void => {
        this.streamList.unwrap().push(note);
        (this as any).update();
    };


    private selectedNote: Note | null = null;

    goToForm() {
        this.dispatchEvent(new CustomEvent("selected-note"))
    }

    selectNote(note: Note) {
        NotesContext.SelectedNote = note;
        this.dispatchEvent(new CustomEvent("selected-note"))
    }

    // Temporal to allow saving real data while development is on early
    download() {
        const streams = this.notesContext.unwrap().getAllNotes();
        const filename = `notes-${new Date().toLocaleDateString()}.json`
        const content = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(streams))}`;
        const link = document.createElement('a');
        link.setAttribute('href', content);
        link.setAttribute('download', filename);
        link.click();
    }


    public submit(data: { title: string, content: string }) {
        const element = (this as unknown as any);
        const notesCtx = this.notesContext.unwrap()
        if (!this.selectedNote) {
            notesCtx.addNewNote(new NewNoteRequest(data.title, data.content));
        } else {
            notesCtx.updateNote(new NoteChangesRequest(
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
        this.notesContext.unwrap().removeNote(noteId)
    }

    connectedCallback() {
        const element = (this as unknown as any);

        const ctx = this.notesContext.unwrap()

        ctx.onAppendNoteObservable.subscribe(this.onAddedNoteObserver)
        ctx.onRemoveNoteObservable.subscribe((id) => {
            this.streamList.unwrap().removeItem(id);
        });

        ``
        // Think on a better way to handle this?
        // this.renderNotesForms();
        element.update();

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
