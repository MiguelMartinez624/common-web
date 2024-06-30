import {Attribute, QueryElement, QueryResult, WebComponent} from "@commonweb/core";
import {TaskItem, TaskState} from "../domain/model";

@WebComponent({
    selector: `todo-column`,
    //language=HTML
    template: `
        <div class="header">
            <h3>{{@host:[title]}}</h3>
        </div>
        <div class="list">
            <template loop-key="id" for-each="@host:[tasks]">
                <todo-card data="{{@host:[data]}}"></todo-card>
            </template>
        </div>

    `,
    //language=CSS
    style: `
        h3 {
            margin: 0;
        }

        .header {
            background: #28324c;
            padding: 1rem 5px;
        }

        .list {
            background: #28324c;
            padding: 5px;
            overflow-y: auto;
            height: 90%;
        }
    `
})
export class TodoColumnComponent extends HTMLElement {

    public static SELECTED_CARD: TaskItem | null = null;

    @QueryElement(".list")
    public cardsColumn: QueryResult<HTMLDivElement>;

    @QueryElement("[for-each]")
    public cardsElementsList: QueryResult<HTMLDivElement>;

    public tasks: TaskItem[] = [];

    public title: string = "";


    connectedCallback() {
        const column = this.cardsColumn.unwrap();

        column.addEventListener("dragover", (ev) => ev.preventDefault());

        column.addEventListener("dragenter", (ev) => {
            console.log("dragin up")
        });

        column.addEventListener("drop", (ev) => {
            this.dispatchEvent(new CustomEvent("card-dropped", {detail: ev.dataTransfer.getData("text/plain")}))
        })
    }

    removeTask(cardId: string) {
        const index = this.tasks.findIndex((t: TaskItem) => t.id === cardId);
        this.tasks.splice(index, 1);
        (this as any).update();
    }

    appendTask(taskItem: TaskItem) {
        this.tasks.push(taskItem);
        (this as any).update();
    }

    getState(): TaskState {
        switch (this.getAttribute('state')) {
            case 'InProgress':
                return TaskState.InProgress;
            case 'Completed':
                return TaskState.Completed;
            case 'Pending':
                return TaskState.Pending;
            default:
                throw "INVALID STATE";
        }
    }
}
