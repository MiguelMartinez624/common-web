import {WebComponent} from "../web_components";
import {ElementBind} from "../bindings/element_bind";
import {Attribute} from "../attributes";
import {bindFromString} from "../bindings";
import {LocalStorageBind} from "../bindings/localstorage_bind";

@WebComponent({
    selector: 'conditional-render-cases',
    template: '<slot></slot>',
})
export class ConditionalRenderCasesComponent extends HTMLElement {

    static get observedAttributes(): string[] {
        return ["state"]
    }

    connectedCallback() {
        this.evaluateCases();
    }

    @Attribute("state")
    public updateState(newState: string) {
        this.evaluateCases();
    }

    private evaluateCases() {
        this.querySelectorAll("*[case]").forEach((el: HTMLElement) => {
            el.style.display = this.getAttribute("state") === el.getAttribute("case") ? "block" : "none";
        });
    }
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

    static get observedAttributes(): string[] {
        return ["condition", "html"]
    }

    connectedCallback() {
        this.evaluateCases();
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
                const slot = this.shadowRoot.querySelector("slot") as HTMLSlotElement;
                if (!result) {
                    slot.innerHTML = "";
                } else {
                    slot.innerHTML = this.getAttribute("html");
                }

                break;
        }

    }
}

