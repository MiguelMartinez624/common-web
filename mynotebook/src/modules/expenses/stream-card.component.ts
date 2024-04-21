import {WebComponent} from "@commonweb/core";
import {Stream} from "./models";

@WebComponent({
    // language=CSS
    style: `
        .detail-header {
            display: flex;
            align-items: center;
            border-bottom: 1px solid white;
            padding: 1rem;
            justify-content: space-between;
        }

        .small-icon {
            height: 20px;
            width: 20px;
            fill: white;
        }

        h4, h3, h5 {
            margin: 0;
        }

        .card {
            padding: 0.5rem;
            outline-offset: 4px;
            outline: var(--card-outline);
            border-radius: 5px;
            background: var(--card-bg);
            color: var(--card-fc);
            margin: 1.4rem 0px;

        }

        cw-trash-icon {
            height: 20px;
            width: 15px;
        }

        .line {
            height: 20px;
            width: 1px;
            background: white;
        }

        .fixed {
            width: 100%;
            position: fixed;
            transition: all 0.2s ease-out;
            top: 0;
            height: calc(100% - 50px);
            background: var(--card-bg);
            left: 0;
            z-index: 2;
        }

        .collapse {

            left: -100%;
            overflow: hidden;
        }`,
    selector: `stream-card`,
    //language=HTML
    template: `
        <div class="card">
            <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 10px">
                <h5>{{@host:[data.title]}}</h5>
                <span style="color: #02b9b9;font-size: small">{{@host:[data.type]}}</span>
            </div>
            <span style="font-size: x-large">{{@host:[data.totalAmount]}}</span>
            <div style="display: flex;justify-content: end;align-items: center;gap:8px">
                <strong> {{@host:[data.transactionsCount]}}</strong>
                <cw-tansaction-icon class="small-icon">
                    <bind-element
                            value="collapse"
                            from="@parent:(click)"
                            to="[details]:toggleClass"></bind-element>
                </cw-tansaction-icon>
                <div class="line"></div>
                <cw-trash-icon>
                    <bind-element
                            from="@parent:(click)"
                            to="[confirmation]:toggle">
                    </bind-element>
                </cw-trash-icon>

            </div>
        </div>
        <bind-element value="{{@host:[data.id]}}"
                      from=".card:(click)"
                      to="expenses-list:setStreamID">
        </bind-element>

        <confirmation-modal confirmation>
            <bind-element
                    from="@parent:(click)"
                    to="stream-card:removeStream">
            </bind-element>
        </confirmation-modal>

        <div toggle details class="collapse fixed">
            <div>
                <div class="detail-header">
                    <cw-left-arrow-icon>
                        <bind-element
                                value="collapse"
                                from="@parent:(click)"
                                to="[details]:toggleClass">
                        </bind-element>
                    </cw-left-arrow-icon>
                    <h3>{{@host:[data.title]}}</h3>
                    <span style="color: #02b9b9">{{@host:[data.type]}}</span>
                </div>
                <div style="padding: 1rem;">
                    <expenses-list></expenses-list>
                </div>
            </div>
        </div>
    `,

})
export class StreamCardComponent extends HTMLElement {
    public data: Stream;

    public removeStream(): void {
        const event = new CustomEvent("remove-stream", {detail: this.data.id});
        this.dispatchEvent(event);
    }
}
