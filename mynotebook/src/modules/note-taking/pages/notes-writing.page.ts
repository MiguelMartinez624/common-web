import {QueryElement, QueryResult, WebComponent} from "@commonweb/core";
import {Observer} from "../../core";
import {NewNoteRequest, Note, NoteChangesRequest} from "../domain";
import {FloatingContentComponent} from "../../../layout";
import {NoteFormComponent, NotesContext} from "../components";
import {BUTTON_STYLE, CARD_STYLE} from "../../../ui/styles";

@WebComponent({
    selector: "notes-writing-page",
    // language=HTML
    template: `
        <div>
            <h2>Notes</h2>
        </div>

        <div style="display: flex;width: 100%">
            <div style="width: 100%;height: 78vh;">
                <div style="display: flex;align-items: center;justify-content: space-between">
                    <div class="y-center">
                        <button class="btn">
                            <span style="font-size:30px;font-weight: 300"> < </span>
                            <bind-element from="@parent:(click)" to="@host:goBack">
                            </bind-element>
                        </button>
                    </div>
                </div>
                <div style="display: flex;gap: 1rem">
                    <notes-context></notes-context>
                    <div style="flex: 1">
                        <notes-form>
                            <bind-element input-path="detail" from="@parent:(submit)"
                                          to="notes-writing-page:submit"></bind-element>
                        </notes-form>
                    </div>
                    <bind-element input-path="detail" from="notes-form:(preview)"
                                  to="notes-preview:[note]"></bind-element>
                    <div style="flex: 1">
                        <notes-preview></notes-preview>
                    </div>
                </div>
            </div>
        </div>
        </div>
    `,
    // language=CSS
    style: `
        .y-center {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 10;
        }


        ${BUTTON_STYLE}
        ${CARD_STYLE}
    `
})
export class NotesWritingPage extends HTMLElement {

    @QueryElement("notes-context")
    private notesContext: QueryResult<NotesContext>;


    @QueryElement("notes-form")
    private notesForms: QueryResult<NoteFormComponent>;

    public goBack(): void {
        NotesContext.SelectedNote = null;
        this.dispatchEvent(new CustomEvent("go-back"))
    }

    public submit(data: { title: string, content: string }) {
        const notesCtx = this.notesContext.unwrap()
        if (!NotesContext.SelectedNote) {
            notesCtx.addNewNote(new NewNoteRequest(data.title, data.content));
        } else {
            notesCtx.updateNote(new NoteChangesRequest(
                NotesContext.SelectedNote.id,
                data.title,
                data.content,
                NotesContext.SelectedNote.creationDate));
        }

        NotesContext.SelectedNote = null;
        this.goBack();
    }


    connectedCallback() {
        if (NotesContext.SelectedNote) {
            this.notesForms.unwrap().setValue(NotesContext.SelectedNote);
        }

    }


}
