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
                        to="[detail]:toggleClass">
                </bind-element>
            </h3>
            <p class="wrap">
                {{@host:[data.description]}}
            </p>
            <div style="display: flex;
                    justify-content: end;
                    align-items: center; gap: 6px;">
                1
                <cw-comment-icon style="fill: white;height: 15px;width: 15px"></cw-comment-icon>
            </div>
        </div>
    `,
    // language=CSS
    style: `
     
        
        ${CARD_STYLE}


        .card{
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
