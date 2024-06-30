import {WebComponent} from "@commonweb/core";
import {CARD_STYLE} from "./styles";
import {ExpensesContext} from "./expenses-context";
import {Stream} from "./models";


@WebComponent({
    selector: "expenses-page",
    // language=HTML
    template: `
        <div class="page">
            <div style="display: flex;justify-content: space-between;align-items: center">
                <span class="y-center">    <h4>Streams</h4></span>

                <!-- actions                -->
                <div class="y-center">
                    <button class="btn">
                        <bind-element from="@parent:(click)" to="@host:download">
                        </bind-element>
                        <div class="y-center">
                            <cw-download-icon></cw-download-icon>
                            Download
                        </div>

                    </button>
                    <button class="btn">
                        <span style="font-size:30px;font-weight: 300">+</span>
                        <bind-element from="@parent:(click)" to="floating-content:toggle">
                        </bind-element>
                    </button>
                </div>

            </div>
            <expenses-context></expenses-context>
            <div style="overflow: auto;height:85vh;position: relative">
                <div class="card">
                    <span class="income stream-summary">Available <span> {{@host:[streamSummary.available]}}</span></span>
                    <span class="income stream-summary">Pending <span> {{@host:[streamSummary.pending]}}</span></span>
                    <span class="outcome stream-summary">Debt <span> {{@host:[streamSummary.debt]}}</span></span>
                </div>

                <template stream-list
                          loop-key="id"
                          for-each="expenses-context:getAllStreams">
                    <stream-card data="{{@host:[data]}}">
                        <bind-element
                                input-path="detail"
                                from="@parent:(remove-stream)"
                                to="expenses-page:removeStream">
                        </bind-element>
                    </stream-card>
                </template>

            </div>
        </div>

        <floating-content>
            <div class="card" slot="content" form>
                <stream-form>
                    <bind-element
                            from="@parent:(submit)"
                            to="floating-content:toggle">
                    </bind-element>
                </stream-form>
            </div>
        </floating-content>

    `,
    // language=CSS
    style: `
        .page {
            max-width: 30vw;
        }

        @media (max-width: 800px) {
            .page {
                max-width: 100%;
                width: 100%;
            }
        }

        .btn {
            padding: 0 15px;
            height: 44px;
            display: flex;
            background: none;
            color: var(--content-fg);
            border: none;
            align-items: center;
            border: 1px solid cyan;
            border-radius: 6px;
        }

        cw-download-icon {
            height: 22px;
            width: 15px;
        }

        .y-center {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .income {
            color: lightgreen;
        }

        .outcome {
            color: lightcoral;
        }

        .stream-summary {
            display: flex;
            justify-content: space-between;
            border-bottom: 0.5px solid var(--card-fc);
            padding: 10px 0px;
            font-weight: bold;
        }

        ${CARD_STYLE}
    `
})
export class ExpensesPage extends HTMLElement {
    public streamSummary: { available: string; pending: string; debt: string };

    // Temporal to allow saving real data while development is on early
    download() {
        const element = (this as unknown as any);
        element
            .query()
            .where("expenses-context")
            .then((ctx: ExpensesContext) => {
                // hack for downlaod file
                const streams = ctx.getAllStreams();
                const filename = `expenses-${new Date().toLocaleDateString()}.json`
                const content = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(streams))}`;
                const link = document.createElement('a');
                link.setAttribute('href', content);
                link.setAttribute('download', filename);
                link.click();
            })
            .catch(console.error)
            .build()
            .execute();
    }

    connectedCallback() {

        const element = (this as unknown as any);
        element
            .query()
            .where("expenses-context")
            .then((ctx: ExpensesContext) => {

                this.streamSummary = ctx.getStreamsSummary();


                ctx.onStreamAppend((stream: Stream) => {
                    element
                        .query()
                        .where("[stream-list]")
                        .then((list: any) => {
                            this.streamSummary = ctx.getStreamsSummary();
                            list.push(stream);
                            this.streamSummary = ctx.getStreamsSummary();
                            element.update();
                        })
                        .catch(console.error)
                        .build()
                        .execute();
                });

                ctx.onRemoveStreamObservable.subscribe((stream: Stream) => {
                    element
                        .query()
                        .where("[stream-list]")
                        .then((list: any) => {
                            console.log("removing from list")
                            list.removeItem(stream.id);
                            this.streamSummary = ctx.getStreamsSummary();

                            element.update()
                        })
                        .catch(console.error)
                        .build()
                        .execute();
                });


            })
            .catch(console.error)
            .build()
            .execute();

        (this as any).update();
    }


    removeStream(streamID: string) {
        const element = (this as unknown as any);

        element
            .query()
            .where("expenses-context")
            .then((ctx: ExpensesContext) => {
                ctx.removeStream(streamID);
            })
            .catch(console.error)
            .build()
            .execute();
    }
}
