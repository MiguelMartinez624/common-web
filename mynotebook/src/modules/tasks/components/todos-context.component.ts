import {QueryElement, QueryResult, WebComponent} from "@commonweb/core";
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

    @QueryElement("local-storage-value")
    public streamData: QueryResult<LocalStorageComponent>;

    public getAllTodosByState(): TaskItem[] {
        if (!this.streamData) {
            return []
        }

        const todos = this.streamData.unwrap().value;
        if (!todos) {
            return;
        }

        return todos;
    }

    connectedCallback() {
        const list = this.streamData.unwrap();
        list.removeKey();
        list.setValue(generateRandomTaskItems(1, 2))
    }


    getTaskById(cardId: string): TaskItem | null {
        const list = this.streamData.unwrap();
        return list.value.find((task: TaskItem) => task.id === cardId) || null;
    }

    changeTableState(card: TaskItem) {
        const list: any = this.streamData.unwrap();
        list.updateValue(card);
    }
}


