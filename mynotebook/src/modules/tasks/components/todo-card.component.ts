import {QueryElement, QueryResult, WebComponent} from "@commonweb/core";
import {TaskItem} from "../domain/model";
import {CARD_STYLE} from "../../../ui/styles";

@WebComponent({
    selector: `todo-card`,
    // language=HTML
    template: `
        <div draggable="true" class="card selectable">
            <div style="display: flex;justify-content: space-between">
                <h3>{{@host:[data.title]}}
                    <bind-element
                            value="collapse"
                            from="@parent:(click)"
                            to="cw-modal:toggle">
                    </bind-element>
                </h3>
                <div style="display: flex;align-items: center; gap: 5px">
                    <img title="{{@host:[data.user.name]}}"
                         style="border-radius: 50%;" height="40" width="40"
                         src="{{@host:[data.user.avatar]}}" alt="">
                </div>
            </div>


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
            <div class="card" style="width: 700px; padding: 20px">
                <div style="display: flex;">
                    <h4>{{@host:[data.title]}}</h4>
                </div>
                <div style="display: flex;align-items: center;justify-content: space-between">
                    <div style="display: flex;align-items: center;gap:10px">
                        <div class="avatar-img"></div>
                        <p>Miguel Martinez</p>
                    </div>
                    <div>
                        <span>{{@host:[data.state]}}</span>
                    </div>
                </div>
                <div>
                    <h4>Decription</h4>
                    <p class="description">
                        {{@host:[data.description]}}
                    </p>
                </div>
                <wc-tabs default="Comments" data="{{@host:[data]}}">
                    <wc-tab default="true" title="Comments"></wc-tab>
                    <wc-tab title="History"></wc-tab>

                    <cw-comments-box slot="content" tab-case="Comments"
                                     comments="{{@host:[data.comments]}}">
                    </cw-comments-box>
                    <div slot="content" tab-case="History">
                        Este es el fuckin historial
                    </div>

                </wc-tabs>

            </div>
        </cw-modal>

    `,
    // language=CSS
    style: `
        wc-tab {
            flex: 1;
        }

        ${CARD_STYLE}
        .selectable:hover {
            cursor: pointer;
            outline: 1px solid;
        }

        .description {
            height: 21vh;
            word-break: break-word;
            overflow: scroll;
        }

        .avatar-img {
            height: 50px;
            width: 50px;
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

    @QueryElement(".card")
    public cardQuery: QueryResult<HTMLElement>;

    @QueryElement("img")
    public imgQuery: QueryResult<HTMLImageElement>;

    connectedCallback() {
        const card = this.cardQuery.unwrap();
        const imgElement = this.imgQuery.unwrap();

        imgElement.onerror = () => {
            console.log("could not load this image")
            const parent = imgElement.parentElement;
            // language=HTML


            imgElement.remove();
            // TODO make a reusable component and make the color selection randomly.
            parent.innerHTML += `<div 
                    style="
                    display: flex;align-items: center;justify-content: center;
                    font-weight: bold;
                    font-size: 16px;
                    
                    height: 40px;width: 40px;background: orange;color: white;border-radius: 50%">
                ${this.data.user.name[0].toUpperCase()}${this.data.user.lastname[0].toUpperCase()}
            </div>`

        }


        card.addEventListener("dragstart", (ev) => {
            ev.dataTransfer.setData("text/plain", this.data.id);
        });


        card.addEventListener("dragend", (ev) => {

        })
    }

    public setUserNameInitialsFallback() {

    }

}
