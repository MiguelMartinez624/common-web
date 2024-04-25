import {WebComponent} from "@commonweb/core";
import {NoteChangesRequest, NewNoteRequest, Note} from "./models";
import {LocalStorageComponent} from "@commonweb/components";
import {Observable} from "../core";
import {Stream} from "../expenses/models";


@WebComponent({
    selector: "notes-context",
    // language=HTML
    template: `
        <local-storage-value
                property-matcher="id"
                item-key="id"
                streams-list
                key="demo-notes">
        </local-storage-value>
    `,
})
export class NotesContext extends HTMLElement {
    public onAppendNoteObservable: Observable<Note> = new Observable<Note>();
    public onRemoveNoteObservable: Observable<string> = new Observable<string>();

    public getAllNotes(): Note[] {
        let notes: Note[] = [];
        (this as any)
            .query()
            .where(`[streams-list]`)
            .then((localStorage: LocalStorageComponent) => {
                const storageValue = localStorage.value;
                if (!storageValue) {
                    return;
                }

                notes = storageValue.map(Note.fromObject);
            })
            .catch(console.error)
            .build()
            .execute();


        return notes;
    }


    public addNewNote(req: NewNoteRequest) {
        (this as any)
            .query()
            .where(`[streams-list]`)
            .then((localStorage: LocalStorageComponent) => {
                const note = req.execute();
                localStorage.append(note);
                // should return
                this.onAppendNoteObservable.notify(note);
            })
            .catch(console.error)
            .build()
            .execute();
    }

    public updateNote(req: NoteChangesRequest) {
        (this as any)
            .query()
            .where(`[streams-list]`)
            .then((localStorage: LocalStorageComponent) => {
                const note = req.execute();
                localStorage.updateValue(note);
                // should return
                this.onAppendNoteObservable.notify(note);
            })
            .catch(console.error)
            .build()
            .execute();
    }


    removeNote(noteId: string) {
        (this as any)
            .query()
            .where(`[streams-list]`)
            .then((localStorage: LocalStorageComponent) => {
                localStorage.removeItem(noteId);
                this.onRemoveNoteObservable.notify(noteId);
            })
            .catch(console.error)
            .build()
            .execute();
    }
}
