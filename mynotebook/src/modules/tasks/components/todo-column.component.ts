import {Attribute, WebComponent} from "@commonweb/core";
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

    public tasks: TaskItem[] = [];

    public title: string = "";

}
