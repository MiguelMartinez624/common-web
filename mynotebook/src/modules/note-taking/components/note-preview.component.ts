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
        const contentElement = this.content.unwrap();
        const nodes = this.separateTextHtml(d.content);
        contentElement.innerHTML = "";

        nodes.forEach(n => {
            if (n.format === "text") {
                const text = document.createElement("p");
                text.innerText = n.content;
                contentElement.appendChild(text);
            } else if (n.format === "html") {
                const snipped = document.createElement("html-snipped");
                snipped.setAttribute("html", n.content);
                contentElement.appendChild(snipped);
            }
        })

    }

    static get observedAttributes(): string[] {
        return ["note"]
    }


    separateTextHtml(text) {
        const textNodes = [];
        const section = text.split("```html")
        for (const char of section) {
            if (char.endsWith("```")) {
                textNodes.push({content: char.replace("```", ""), format: "html"})
            } else {
                textNodes.push({content: char, format: "text"})
            }
        }
        return textNodes;
    }

}
