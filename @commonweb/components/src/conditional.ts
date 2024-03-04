import {
    Attribute,
    WebComponent
} from "@commonweb/core";


@WebComponent({
    selector: 'conditional-render-cases',
    template: '<slot></slot>',
})
export class ConditionalRenderCasesComponent extends HTMLElement {
    private _case: string;

    static get observedAttributes(): string[] {
        return ["case"]
    }

    connectedCallback() {
        this.evaluateCases();
    }

    @Attribute("case")
    public set case(newCase: string) {
        this._case = newCase;
        this.evaluateCases();
    }

    public changeCase(newState: string) {
        this._case = newState;
        this.evaluateCases();
    }

    private evaluateCases() {

        this.querySelectorAll("*[case]").forEach((el: HTMLElement) => {
            const isTemplated = el.children[0] && el.children[0].tagName === "TEMPLATE";
            const show = this._case === el.getAttribute("case");

            if (show && isTemplated && !el.getAttribute("is-active")) {

                const fragment = document.createRange().createContextualFragment(
                    `<div is-active="true">${el.children[0].innerHTML}</div>`);
                el.appendChild(fragment)
                el.setAttribute("is-active", "true")
            } else if (!show && isTemplated) {
                el.querySelector("[is-active]")?.remove();
                el.removeAttribute("is-active")

                // Remoe
            } else {
                el.style.display = show ? "block" : "none";
            }


        });
    }
}



