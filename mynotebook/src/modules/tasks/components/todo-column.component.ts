import {Attribute, QueryElement, QueryResult, WebComponent} from "@commonweb/core";
import {TaskItem} from "../domain/model";

@WebComponent({
    selector: `todo-column`,
    //language=HTML
    template: `
        <div class="header">
            <h3>{{@host:[title]}}</h3>
        </div>
        <div class="list">
            <template loop-key="date" for-each="@host:[tasks]">
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

    @QueryElement(".list")
    public cardsColumn: QueryResult<HTMLDivElement>;

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

}
