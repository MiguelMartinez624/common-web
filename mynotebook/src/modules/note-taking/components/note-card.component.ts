import {Attribute, WebComponent} from "@commonweb/core";
import {Note} from "../domain";
import {CARD_STYLE} from "../../../ui/styles";

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

        ${CARD_STYLE}
        
        .card {
            height: 150px;
            display: flex;
            flex-direction: column;
            justify-content:space-between;
        }

        .card:hover {
            cursor: pointer;
            outline: 1px solid;
        }

        cw-trash-icon {
            cursor: pointer;
            width: 18px;
            height: 18px;
        }
    `,
    selector: `note-card`,
    //language=HTML
    template: `
        <div class="card">

            <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 10px">

                <h3>{{@host:[data.title]}}</h3>
                <span style="color: #02b9b9;font-size: small;">{{@host:formattedDate}}</span>

            </div>
            <div style="flex: 1">
                <bind-element
                        from="@parent:(click)"
                        to="@host:selectNote">
                </bind-element>
                <p style="color: #02b9b9;font-size: small;overflow: hidden; max-height: 68px;cursor: pointer;">
                    {{@host:contentPreview}}
                </p>
            </div>
            <div style="display: flex;justify-content: end;align-items: center;gap:8px">
                <cw-trash-icon>
                    <bind-element
                            from="@parent:(click)"
                            to="[confirmation]:toggle">
                    </bind-element>
                </cw-trash-icon>
            </div>
        </div>

        <confirmation-modal
                confirmation>
            <bind-element
                    from="@parent:(confirm)"
                    to="note-card:removeNote">
            </bind-element>
        </confirmation-modal>

    `,

})
export class NoteCardComponent extends HTMLElement {
    public data: Note;

    public removeNote(): void {
        const event = new CustomEvent("remove-note", {detail: this.data.id});
        this.dispatchEvent(event);
    }

    public selectNote() {
        this.dispatchEvent(new CustomEvent("note-selected", {detail: this.data}))
    }

    public contentPreview(): string {
        if (!this.data) {
            return "";
        }

        return this.data.content.slice(0, 180) + "...";
    }

    public formattedDate(): string {
        if (!this.data) {
            return "00/00/0000";
        }

        return this.data.creationDate.toLocaleDateString();
    }
}
