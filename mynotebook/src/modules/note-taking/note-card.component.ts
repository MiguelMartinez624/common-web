import {WebComponent} from "@commonweb/core";
import {Note} from "./models";

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
                <span style="color: #02b9b9;font-size: small">{{@host:formattedDate}}</span>
               
            </div>
            <div>
                <bind-element
                        from="@parent:(click)"
                        to="@host:selectNote">
                </bind-element>
                <p style="color: #02b9b9;font-size: small;overflow: hidden; max-height: 40px;cursor: pointer;">
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
    private data: Note;

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

        return this.data.content.slice(0, 120) + "...";
    }

    public formattedDate(): string {
        if (!this.data) {
            return "00/00/0000";
        }

        return this.data.creationDate.toLocaleDateString();
    }
}
