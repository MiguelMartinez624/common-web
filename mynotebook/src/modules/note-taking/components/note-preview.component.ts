import {Attribute, QueryElement, QueryResult, WebComponent} from "@commonweb/core";
import {FormGroup, TextareaField} from "@commonweb/forms";
import {BUTTON_STYLE, CARD_STYLE} from "../../../ui/styles";
import {Note} from "../domain";

@WebComponent({
    selector: `notes-preview`,
    // language=HTML
    template: `
        <div class="card">
            <h4>
                {{@host:[_note.title]}}
            </h4>
            <section></section>
        </div>
    `,
    //language=CSS
    style: `
        .card {
            height: 100%;
            overflow: scroll;
        }

        ${CARD_STYLE}
        ${BUTTON_STYLE}
    `
})
export class NotePreviewComponent extends HTMLElement {


    @QueryElement("section")
    private content: QueryResult<HTMLElement>;


    private _note: { title: string; content: string } = {title: " ", content: " "};

    @Attribute("note")
    public set note(d: { title: string, content: string }) {
        this._note = d;
        const contentElement = this.content.unwrap();
        const nodes = this.separateTextHtml(d.content);
        contentElement.innerHTML = "";
        nodes.forEach(n => {
            if (n.format === "text") {
                const text = document.createElement("p");
                text.innerText = n.content;
                contentElement.appendChild(text);
            } else {
                const snipped = document.createElement("code-snipped");
                snipped.setAttribute("language", n.format);

                snipped.setAttribute("source", n.content);
                contentElement.appendChild(snipped);
            }

        });

        (this as any).update();
    }

    static get observedAttributes(): string[] {
        return ["note"]
    }


    separateTextHtml(text) {
        const textNodes = [];
        const section = text.split("```")
        for (const char of section) {
            if (char.startsWith("html")) {
                textNodes.push({content: char.replace("html", "").replace("```", ""), format: "html"})
            } else if (char.startsWith("golang")) {
                textNodes.push({content: char.replace("golang", "").replace("```", ""), format: "golang"})
            } else {
                textNodes.push({content: char, format: "text"})
            }
        }
        return textNodes;
    }

}
