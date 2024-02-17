import {bindTemplateToProperties, WebComponent} from "../web_components";
import {ElementBind} from "../bindings/element_bind";
import {Attribute} from "../attributes";
import {bindFromString} from "../bindings";
import {LocalStorageBind} from "../bindings/localstorage_bind";
import {extractData} from "../html_manipulation";
import {callRemoteAPI} from "./data-store.componnet";

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
    selector: 'for-each',
    template: '',
})
export class ForEachComponent extends HTMLElement {
    @Attribute("component")
    // componentName will be evaluated as first priority and if its not null
    // then a component will be created, data pass to it and injected into this
    // component parent
    public componentName: string | null = null;

    @Attribute("html")
    // html will be created into a node and injected into the parent
    // component
    public html: string | null = null;

    @Attribute("push-order")
    // pushOrder decide wherever gonna append to the end or the begining
    // of the list
    public pushOrder: "start" | "end" = "end";

    @Attribute("added-sign-duration")
    // addedTimeDuration time that the special class will be applied to it
    // is on ms (milliseconds)
    public addedTimeDuration: number = 3000;

    @Attribute("identifier-path")
    // identifierPath the path to a property that will me attached to each prjected element
    // so it can be easily identified
    public identifierPath: string = "";


    public static get observedAttributes(): string[] {
        return ["html", "component", "push-order", "data", "added-sign-duration", "identifier-path"]
    }


    @Attribute("data")
    public data(data: any[]): void {
        if (Array.isArray(data)) {
            data.forEach((ele) => this.projectContent(ele, false));
        }
    }

    // Push a element to the projection target
    public push(data: any): void {
        this.projectContent(data, true);
    }

    // Push a element to the projection target
    public removeNode(id: string): void {
        const cssIdentifer = `[loop-id="${id}"]`;
        const nodeToRemove = this.parentElement.querySelector(cssIdentifer);
        if (!nodeToRemove) {
            return console.warn("not element under ", cssIdentifer)
        }
        nodeToRemove.remove();
    }


    private renderByComponent(data: any) {
        const sections = this.componentName.split(":");
        const component = document.createElement(sections[0]);
        // passing data as a function to avoid JSON stringify
        component.setAttribute(sections[1], JSON.stringify(data));
        if (this.pushOrder === "end") {
            return this.parentElement.appendChild(component);
        } else {
            throw "Feature under development"
        }
    }

    private projectContent(data: any, mark: boolean) {
        if (!data) {
            return
        }

        const itsTemplate = this.html.startsWith("<template-view");
        // Create the template-view as its gonna be required any ways we pass a template down
        const node = document
            .createRange()
            .createContextualFragment(itsTemplate ? this.html : `<template-view>${this.html}</template-view>`)
        const id = this.generateIdentifier(data);
        node.children.item(0).setAttribute("loop-id", id);
        node.children.item(0).setAttribute("data", JSON.stringify(data));


        if (mark) {
            node.children.item(0).classList.add("loop-injected");
            setTimeout(() => {
                const cssIdentifer = `[loop-id="${id}"]`;
                const item = this.parentElement.querySelector(cssIdentifer);
                item?.classList.remove("loop-injected");
            }, Number(this.addedTimeDuration));
        }

        // insert at the end to make all changes effect
        this.parentElement.appendChild(node);

    }

    private generateIdentifier(data: any): string {
        if (this.identifierPath === "") {
            return typeof data === "string" ? data : JSON.stringify(data);
        }
        const id = extractData(this.identifierPath, data);
        if (!id) {
            console.warn("identifier not found")
        }
        console.log({id})
        return id;
    }
}


@WebComponent({
    selector: 'template-view',
    template: '<slot></slot>',
    useShadow: false,
})
export class TemplateView extends HTMLElement {
    @Attribute("data")
    // componentName will be evaluated as first priority and if its not null
    // then a component will be created, data pass to it and injected into this
    // component parent
    public data: any | null = null;

    @Attribute("view")
    // componentName will be evaluated as first priority and if its not null
    // then a component will be created, data pass to it and injected into this
    // component parent
    public set view(view: string) {
        if (view.startsWith("http:") || view.startsWith("https:")) {
            callRemoteAPI(view, "GET", {})
                .then((result) => this.view = result)
        } else {
            this.shadowRoot ? this.shadowRoot.innerHTML = view : this.innerHTML = view;

            // check the view to create the interpolations
            bindTemplateToProperties(this);
        }
    }

    public static get observedAttributes(): string[] {
        return ["data", "view"]
    }

}


