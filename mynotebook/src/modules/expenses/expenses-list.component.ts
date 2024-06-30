import {Attribute, WebComponent} from "@commonweb/core";
import {ExpensesContext} from "./expenses-context";
import {CARD_STYLE} from "./styles";
import {Transaction} from "./models";

@WebComponent({
    selector: "expenses-list",
    // language=HTML
    template: `
        <div>
            <h4>Transaction List</h4>
        </div>
        <expenses-context></expenses-context>
        <div style="overflow: auto;height: 84vh;padding: 3px">
            <template expenses-list loop-key="date" for-each="expenses-context:findStreamExpenses">

                <expense-list-by-date
                        stream-id="{{@host:[stream-id]}}"
                        data="{{@host:[data]}}">
                </expense-list-by-date>
                <bind-element
                        input-path="detail"
                        from="expense-list-by-date:(delete)"
                        to="expenses-list:removeExpense">
                </bind-element>
            </template>

            <floating-content>
                <cw-plus-icon slot="trigger"></cw-plus-icon>

                <div class="card" slot="content" form>
                    <expense-form>
                        <bind-element from="@parent:(submit)" to="floating-content:toggle"></bind-element>
                        <bind-element input-path="detail" from="@parent:(submit)"
                                      to="expenses-list:handleSubmit"></bind-element>
                    </expense-form>
                </div
            </floating-content>

        </div>


    `,
    // language=CSS
    style: `
        h4 {
            margin: 0;
        }

        ${CARD_STYLE}

    `,
})
export class ExpensesListComponent extends HTMLElement {
    @Attribute("stream-id")
    public streamID: string;


    public removeExpense(data: string) {
        (this as unknown as any)
            .query()
            .where('expenses-context')
            .then((ctx: ExpensesContext) => {
                const streamId = this.getAttribute("stream-id");
                ctx.removeTransaction(streamId, data);
                this.loadStreams(streamId);
            })
            .catch(error => console.error(error))
            .build()
            .execute();
    }

    public handleSubmit(data: Transaction) {
        (this as unknown as any)
            .query()
            .where('expenses-context')
            .then((ctx: ExpensesContext) => {
                const streamId = this.getAttribute("stream-id");
                ctx.appendTransactionToStream(streamId, data);
                this.loadStreams(streamId);
            })
            .catch(error => console.error(error))
            .build()
            .execute();
    }

    public setStreamID(streamId: string) {
        console.log({streamId})
        this.setAttribute("stream-id", streamId);
        this.loadStreams(streamId);

    }

    private loadStreams(streamId: string) {
        (this as unknown as any)
            .query()
            .where('expenses-context')
            .then((ctx: ExpensesContext) => {
                const expenses = ctx.findStreamExpenses(streamId);

                (this as unknown as any)
                    .query()
                    .where('[expenses-list]')
                    .then((list: any) => {
                        list.clearAndPush(expenses);
                    })
                    .catch(error => console.error(error))
                    .build()
                    .execute();


            })
            .catch(error => console.error(error))
            .build()
            .execute();
    }
}
