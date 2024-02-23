import {WebComponent} from "../web_components";
import {ElementBind} from "../bindings/element_bind";
import {Attribute} from "../attributes";
import {bindFromString} from "../bindings";
import {LocalStorageBind} from "../bindings/localstorage_bind";
import {interpolateAndRender} from "../directives";


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


@WebComponent({
    selector: 'render-case',
    template: '<template><slot></slot></template>',
})
export class RenderCaseComponent extends HTMLElement {
    @Attribute("case")
    public case: string = "";
}


@WebComponent({
    selector: 'show-if',
    template: '<slot></slot>',
})
export class ShowIfComponent extends HTMLElement {
    public static CONDITION_SEPARATOR: string = "/";
    private leftValue: ElementBind | LocalStorageBind;
    private operator: string;
    private rightValue: ElementBind | LocalStorageBind;


    private insertedNodeRef: Node | null = null;

    public static get observedAttributes(): string[] {
        return ["condition", "html"]
    }

    connectedCallback() {
        // this.updateState(this.getAttribute("condition"));
    }

    /*
    * Condition been [Selector]:[Operator]:[Value][Selector]
    * aca se tomara el valor de la izquierda contra el operador que sera igual o diferente, mayor o menor
    * y se validara contra la derecha q seria en este caso un selector, o un valor en concreto
    * se agregaran metodos logicos de "in", "all" para valores en array tmb
    * tmb tomara valores por localstorage:/ o https:/ en caso de q necesite la respuesta si empieza con un
    * @sera un selector y no estara dentro de {{}} para evitar q el template los tome
    * */
    @Attribute("condition")
    public updateState(newState: string) {

        if (!newState || newState === "") {
            return;
        }
        const tokens = newState.split(ShowIfComponent.CONDITION_SEPARATOR);
        this.leftValue = bindFromString(tokens[0]);
        this.operator = tokens[1];
        this.rightValue = bindFromString(tokens[2]);

        // settings parents and quering elements
        if (this.leftValue instanceof ElementBind) {
            this.leftValue.searchElement(this.parentNode);
        }

        if (this.rightValue instanceof ElementBind) {
            this.rightValue.searchElement(this.parentNode);
        }

        this.evaluateCases();
    }

    // evaluateCases will need to be called manually each time we want to evaluate the condition
    // NOTE : check if a mutationObserver make sense in this case.
    public evaluateCases() {
        switch (this.operator) {
            case "=":
                const result = this.leftValue.value === this.rightValue.value;
                const slot = this.projectionContainer;
                if (!slot) {
                    console.warn("projection slot null")
                    return;
                }
                if (result === false) {
                    this.removeContent();
                } else {
                    this.projectContent(slot);

                }
                break;
        }
    }

    private removeContent() {
        if (this.insertedNodeRef) {
            this.insertedNodeRef.parentNode.removeChild(this.insertedNodeRef);
            this.insertedNodeRef = null;
        }
    }

    private projectContent(slot: HTMLElement) {
        // Dont inject directly on innerHTML as innerHTML modification will
        // check the entire elements tree, creating a loop and stackoverflow
        const template = document.createElement("template");
        template.innerHTML = this.getAttribute("html");
        this.insertedNodeRef = template.content.cloneNode(true);
        slot.appendChild(this.insertedNodeRef);
    }

    public get projectionContainer(): HTMLElement | null {
        return this.parentElement;
    }
}

@WebComponent({
    selector: 'show-if-no-empty',
    template: '',
})
export class ShowIfV2Component extends HTMLElement {


    private insertedNodeRef: Node | null = null;
    private _value: string;

    public static get observedAttributes(): string[] {
        return ["value"]
    }

    connectedCallback() {
        // this.updateState(this.getAttribute("condition"));
    }

    /*
    * Condition been [Selector]:[Operator]:[Value][Selector]
    * aca se tomara el valor de la izquierda contra el operador que sera igual o diferente, mayor o menor
    * y se validara contra la derecha q seria en este caso un selector, o un valor en concreto
    * se agregaran metodos logicos de "in", "all" para valores en array tmb
    * tmb tomara valores por localstorage:/ o https:/ en caso de q necesite la respuesta si empieza con un
    * @sera un selector y no estara dentro de {{}} para evitar q el template los tome
    * */
    @Attribute("value")
    public set value(newState: string) {
        if (typeof newState === "string" && newState.startsWith("{{@host")) {
            return;
        }
        this._value = newState;

        this.evaluateCases();
    }

    // evaluateCases will need to be called manually each time we want to evaluate the condition
    // NOTE : check if a mutationObserver make sense in this case.
    public evaluateCases() {
        if (this._value === undefined || this._value === null || this._value === "") {
            this.removeContent();
        } else {
            this.projectContent()
        }
    }

    private removeContent() {
        if (this.insertedNodeRef) {
            this.insertedNodeRef.parentNode.removeChild(this.insertedNodeRef);
            this.insertedNodeRef = null;
        }
    }

    private projectContent() {
        // Dont inject directly on innerHTML as innerHTML modification will
        // check the entire elements tree, creating a loop and stackoverflow
        const template = this.querySelector("template");
// console.log(this.shadowRoot.innerHTML)
        const range = document.createRange().createContextualFragment(this.innerHTML);
        this.append(this.innerHTML);
    }

}


@WebComponent({
    selector: 'toggable-element',
    template: '<slot></slot>',
})
export class ToggableElement extends HTMLElement {
    public show(): void {
        this.removeAttribute("hidden")
    }

    public hide(): void {
        this.setAttribute("hidden", "true");

    }
}


