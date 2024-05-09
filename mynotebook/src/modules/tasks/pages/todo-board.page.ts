import {QueryElement, QueryResult, WebComponent} from "@commonweb/core";
import {TodosContextComponent} from "../components/todos-context.component";
import {TodoColumnComponent} from "../components";
import {BUTTON_STYLE} from "../../../ui/styles";
import {TaskState} from "../domain";


@WebComponent({
    selector: `todo-board-page`,
    // language=HTML
    template: `
        <todo-context></todo-context>
        <div>
            <h2>Task List</h2>
        </div>
        <div style="display: flex;gap: 2rem;align-items: center">
            <form-field label=" " placeholder="Search..."></form-field>
            <button class="btn mobile">
                <span style="font-size:30px;font-weight: 300">+</span>
                <bind-element from="@parent:(click)" to="floating-content:toggle">
                </bind-element>
            </button>
        </div>

        <div class="board">
            <todo-column state="Pending" title="Pending"></todo-column>
            <todo-column state="InProgress" title="In Progress"></todo-column>
            <todo-column state="Completed" title="Completed"></todo-column>

        </div>
    `,
    // language=CSS
    style: `
        ${BUTTON_STYLE}
        .board {
            display: flex;
            height: 80%;
            gap: 10px;

        &
        todo-column {
            width: 33%;
        }

        }
    `
})
export class TodoBoardPage extends HTMLElement {

    @QueryElement('todo-column[state="Pending"]')
    private pendingColumn: QueryResult<TodoColumnComponent>;

    @QueryElement('todo-column[state="InProgress"]')
    private processColumn: QueryResult<TodoColumnComponent>;

    @QueryElement('todo-column[state="Completed"]')
    private completedColumn: QueryResult<TodoColumnComponent>;

    @QueryElement("todo-context")
    private todoContext: QueryResult<TodosContextComponent>;


    connectedCallback() {

        const ctx = this.todoContext.unwrap();


        const pendingColumn = this.pendingColumn.unwrap();
        pendingColumn.tasks = ctx.getAllTodosByState();
        (pendingColumn as any).update();

        const processColumn = this.processColumn.unwrap();
        // processColumn.tasks = ctx.getAllTodosByState();
        (processColumn as any).update();

        const completedColumn = this.completedColumn.unwrap();
        // completedColumn.tasks = ctx.getAllTodosByState();
        (completedColumn as any).update();

        [pendingColumn, processColumn, completedColumn].forEach((c) => {
            c.addEventListener("card-dropped", (ev: CustomEvent) => {
                const cardId = ev.detail;
                const card = ctx.getTaskById(cardId);
                if (card) {
                    // remove from ord column
                    switch (card.state) {
                        case TaskState.InProgress:
                            processColumn.removeTask(cardId);
                            break;
                        case TaskState.Completed:
                            completedColumn.removeTask(cardId);
                            break;
                        case TaskState.Pending:
                            pendingColumn.removeTask(cardId);
                            break;
                    }
                    card.state = c.getState();
                    ctx.changeTableState(card);

                    c.appendTask(card)
                }
            })
        })


    }

}
