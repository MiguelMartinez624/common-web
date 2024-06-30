import {Attribute, WebComponent} from "@commonweb/core";

@WebComponent({
    selector: "expense-list-by-date",
    //language=CSS
    style: `
        .date-title {
            text-align: center;
            background: #25304d;
            outline: 1px solid #232437;
            padding: 6px;
            border-radius: 7px;
        }

        :host {
            display: block;
            margin: 30px 0px;
            position: relative;
        }

        h5 {
            margin: 0;
        }

        .hidden {
            display: none;
        }
    `,
    //language=HTML
    template: `
        <expenses-context></expenses-context>

        <div>
            <div class="date-title">
                <div style="display: flex;justify-content: center;align-items: center">

                    <span>{{@host:dateFormatted}}</span>
                    <cw-info-icon style="height: 16px;width: 16px;position: absolute;right: 10px;"></cw-info-icon>
                    <bind-element value="hidden" from="cw-info-icon:(click)" to="[details]:toggleClass"></bind-element>
                </div>
                <div toggle details class="hidden">
                    <div style="display: flex;justify-content: space-around;font-size: 16px;margin-top: 6px">
                        <div style="color: lightgreen">
                            <h5>Incomes</h5>
                            {{@host:[data.incomes]}}
                        </div>
                        <div style="color: rgb(198 75 19)">
                            <h5>Outcomes</h5>
                            {{@host:[data.outcomes]}}
                        </div>
                    </div>
                </div>
            </div>
            <template transactions-list loop-key="title" for-each="@host:[data.transactions]">
                <expense-card data="{{@host:[data]}}"></expense-card>
                <bind-element
                        input-path="detail"
                        from="expense-card:(delete)"
                        to="expense-list-by-date:removeItem">
                </bind-element>
            </template>
        </div>
    `
})
export class ExpensesByDateListComponent extends HTMLElement {

    public data: any;

    dateFormatted() {
        if (this.data) {
            const date = new Date(this.data.date);
            const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
            return utcDate.toLocaleDateString('en-EN', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            })
        }

        return ""
    }


    removeItem(param) {
        this.dispatchEvent(new CustomEvent("delete", {detail: param}));
    }

}
