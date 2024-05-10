import {Attribute, WebComponent} from "@commonweb/core";


@WebComponent({
    selector: "html-snipped",
    //language=HTML
    template: `
        <slot></slot>`,
    // language=CSS
    style: `
        :host {
            background: rgb(21, 32, 43);
            display: block;
            padding: 1rem
        }

        .attr-name {
            color: #9393e8;
        }

        .attr-value {
            color: #eeeea7;
        }

        .tag-name {
            color: #ff9999 !important;
        }

        .tag {
            color: #ff9999 !important;
        }

    `
})
export class HtmlSnippedComponent extends HTMLElement {

    @Attribute("html")
    public html: string;


    connectedCallback() {
        if (this.html) {
            this.enhanceHTMLString(this.html);
        }
    }

    static get observedAttributes(): string[] {
        return ['html'];
    }

    private enhanceHTMLString(htmlStr: string) {

        let html = '';
        let nextContent = '';

        const chars = htmlStr.trim().split('');
        for (let i = 0; i < chars.length; i++) {

            let char = chars[i];

            if (char === '<') {
                html += `<span class='tag'>&lt;</span><span class='tag-name'>`;
                nextContent = 'tag-name';
            } else if (char === '>') {
                html += `</span><span class='tag'>&gt;</span>`;
                nextContent = "content"
            } else if (nextContent === 'tag-name' && char !== " ") {
                html += char;
            } else if (nextContent === "content") {
                html += char;
            } else if (char === ' ') {
                if (nextContent === "tag-name") {
                    nextContent = "attribute-name"
                    html += `</span><span class='attr-name'>`
                }
                html += char;
            } else if (char === '=') {
                if (nextContent === "attribute-name") {
                    // Close atribute name
                    html += `</span ><span class="attr-value">`
                    nextContent = "attribute-value";
                }
                html += char;
            } else if (nextContent === "attribute-value" && !["=", "{", ":", " "].includes(chars[i - 1])
                && ![":", ",", "}"].includes(chars[i + 1])
                && (char === '"' || char === "'")) {
                // cerra el valor del attribute canbiando el contexto ahora
                html += char;
                nextContent = "attribute-name";
                html += `</span><span class='attr-name'>`;
            } else {
                html += char;
            }
        }


        // Format HTML using indentation and newlines
        function formatHtml(htmlString) {
            return htmlString.replace(/\n\s+/g, '<br>'); // Remove unnecessary indentation
        }

        const formattedHtml = formatHtml(html);


        this.shadowRoot.innerHTML += `<code>${formattedHtml}</code>`;
        // ident her?
        const tags = this.shadowRoot.querySelectorAll(".tag-name");
        let offsetClose = 0;
        for (let i = 0; i < tags.length; i++) {
            if (i === 0 || i === tags.length - 1) {
                continue
            }
            // TODO agregar tooltops to properties names ?
            const openingTag: any = tags[i].previousSibling;

            const nextNext = tags[i].previousSibling.previousSibling;
            if ((nextNext === null) || (tags[i].textContent.startsWith("/"))) {
                if (nextNext.nodeName !== "BR") {
                    offsetClose = i
                    continue;
                }

                openingTag.style.marginLeft = `${((tags.length - i)) - 1}rem`
            } else {
                openingTag.style.marginLeft = `${i - offsetClose}rem`
            }
        }


    }


}
