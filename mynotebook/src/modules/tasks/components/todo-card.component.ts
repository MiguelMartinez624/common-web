import {WebComponent} from "@commonweb/core";
import {TaskItem} from "../domain/model";
import {CARD_STYLE} from "../../../ui/styles";

@WebComponent({
    selector: `todo-card`,
    // language=HTML
    template: `
        <div class="card">
            <h3>{{@host:[data.title]}}
                <bind-element
                        value="collapse"
                        from="@parent:(click)"
                        to="cw-modal:toggle">
                </bind-element>
            </h3>
            <p class="wrap">
                {{@host:[data.description]}}
            </p>
            <div style="display: flex;
                    justify-content: end;
                    align-items: center; gap: 6px;">
                {{@host:[data.comments.length]}}
                <cw-comment-icon style="fill: white;height: 15px;width: 15px"></cw-comment-icon>
            </div>
        </div>


        <!-- Details -->
        <cw-modal data="{{@host:[data]}}" details>
            <div class="card" style="width: 500px">
                <div style="display: flex;">
                    <h4>{{@host:[data.title]}}</h4>
                </div>
                <div>
                    <div class="avatar-img"></div>
                    <span>{{@host:[data.state]}}</span>
                </div>
                <div>
                    <h4>Decription</h4>
                    <p>
                        {{@host:[data.description]}}
                    </p>
                </div>
                <wc-tabs>
                    <wc-tab default="true" title="Comments">
                        <cw-comments-box comments="{{@host:[data.comments]}}"></cw-comments-box>
                    </wc-tab>
                    <wc-tab title="History"></wc-tab>
                </wc-tabs>

            </div>
        </cw-modal>

    `,
    // language=CSS
    style: `
        ${CARD_STYLE}
        .card:hover {
            cursor: pointer;
        }

        .avatar-img {
            height: 40px;
            width: 40px;
            border-radius: 50%;
            background: lightgray;
        }

        .card {
            margin: 20px 0px;
        }

        p.wrap {
            font-size: smaller;
            color: var(--card-fc);
            opacity: 0.7;
            text-overflow: ellipsis;
            text-wrap: nowrap;
            width: 100%;
            overflow: hidden;
        }

    `
})
export class TodoCardComponent extends HTMLElement {
    public data: TaskItem;

}
