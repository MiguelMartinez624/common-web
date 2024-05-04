import {WebComponent} from "@commonweb/core";
import {Observable} from "../../core";
import {LocalStorageComponent} from "@commonweb/components";
import {TaskItem} from "../domain";
import {generateRandomTaskItems} from "../domain/mock";

@WebComponent({
    selector: "todo-context",
    // language=HTML
    template: `
        <local-storage-value
                property-matcher="id"
                item-key="id"
                streams-list
                key="demo-todos">
        </local-storage-value>
    `,
})
export class TodosContextComponent extends HTMLElement {

    public onAppendNoteObservable: Observable<TaskItem> = new Observable<TaskItem>();
    public onRemoveNoteObservable: Observable<string> = new Observable<string>();
    public streamData: LocalStorageComponent;

    public getAllTodosByState(): TaskItem[] {
        if (!this.streamData) {
            return []
        }

        return generateRandomTaskItems(1,5)

        // const todos = this.streamData.value;
        // if (!todos) {
        //     return;
        // }
        //
        // return todos;
    }

    connectedCallback() {
        (this as any)
            .query()
            .where(`[streams-list]`)
            .then((localStorage: LocalStorageComponent) => {
                this.streamData = localStorage
            })
            .catch(console.error)
            .build()
            .execute();
    }


}


