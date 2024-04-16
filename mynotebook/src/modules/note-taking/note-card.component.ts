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
    selector: `note-card`,
    //language=HTML
    template: `
        <div class="card">
            <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 10px">
                <h3>{{@host:[data.title]}}</h3>
                <span style="color: #02b9b9;font-size: small">{{@host:formattedDate}}</span>
            </div>
            <div>
                <p style="color: #02b9b9;font-size: small;overflow: hidden; max-height: 40px;">
                    {{@host:contentPreview}}
                </p>
            </div>
            <div style="display: flex;justify-content: end;align-items: center;gap:8px">
                
            </div>
        </div>
   

    `,

})
export class NoteCardComponent extends HTMLElement{
    private data: Note;

    public contentPreview():string{
        if(!this.data){
            return "";
        }

        return this.data.content.slice(0,120) + "...";
    }
    public formattedDate():string{
        if(!this.data){
            return "00/00/0000";
        }

        return this.data.creationDate.toLocaleDateString();
    }
}