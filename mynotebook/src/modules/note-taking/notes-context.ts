import {WebComponent} from "@commonweb/core";
import {NewNoteRequest,  Note} from "./models";
import {LocalStorageComponent} from "@commonweb/components";
import {Observable} from "../core";


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


}
