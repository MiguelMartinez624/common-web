import {WebComponent} from "../web_components";
import {Attribute} from "../attributes";
import {extractData, findNodeOnUpTree} from "../html_manipulation";
import {TemplateView} from "./conditional";

@WebComponent({
    style: `:host{position:absolute}`,
    selector: 'for-each',
    template: '',
})
export class ForEachComponent extends HTMLElement {
    @Attribute("component")
    // componentName will be evaluated as first priority and if its not null
    // then a component will be created, data pass to it and injected into this
    // component parent
    public componentName: string | null = null;

    @Attribute("target")
    public target: string = "";

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
        return ["html", "component", "push-order", "data", "added-sign-duration", "identifier-path", "target"]
    }

    private _html: string = '';

    @Attribute("html")
    // html will be created into a node and injected into the parent
    // component
    public set html(html: string) {
        if (html === "") {
            return
        }
        this._html = html;
        this._clear(this._data);
        this._render(this._data);

    };


    private _data: any[] = [];

    @Attribute("data")
    public set data(d: any[]) {
        this._data = d;
        this._clear(d);
        this._render(d);
    }

    // Push a element to the projection target
    public push(data: any): void {
        this.projectContent(data, true);
    }

    // Push a element to the projection target
    public removeNode(id: string): void {
        const cssIdentifier = `[loop-id="${id}"]`;
        const nodeToRemove = this.parentElement.querySelector(cssIdentifier);
        if (!nodeToRemove) {
            return console.warn("not element under ", cssIdentifier)
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
        const itsTemplate = this._html.startsWith("<template-view");
        // Create the template-view as its gonna be required any ways we pass a template down
        const node = document
            .createRange()
            .createContextualFragment(itsTemplate ? this._html : `<template-view view="${this._html}"></template-view>`)
        const id = this.generateIdentifier(data);
        const templateView: TemplateView = node.children.item(0) as TemplateView;

        templateView.setAttribute("loop-id", id);
        // TODO insert via setter instead
        templateView.data = data;


        if (mark) {
            node.children.item(0).classList.add("loop-injected");
            setTimeout(() => {
                const cssIdentifer = `[loop-id="${id}"]`;
                const item = this.parentElement.querySelector(cssIdentifer);
                item?.classList.remove("loop-injected");
            }, Number(this.addedTimeDuration));
        }

        const recipient = this.target !== "" ? findNodeOnUpTree(this.target, this) : this.parentElement;
        if (this.target !== "") {
            // TODO fix for loops using templates only to get interpolation
            node.children.item(0)['checkAllInterpolations']();
            const fragment: DocumentFragment = document
                .createRange()
                .createContextualFragment(node.children.item(0).innerHTML);
            console.log(fragment.children[0])
            fragment.children[0].setAttribute("loop-id", id);
            return recipient.appendChild(fragment);
        }


        // insert at the end to make all changes effect
        recipient.appendChild(node);

    }

    // Revisar bien el For Each porq no esta pasando las propiedades aba
    private generateIdentifier(data: any): string {
        if (this.identifierPath === "") {
            return typeof data === "string" ? data : JSON.stringify(data);
        }
        const id = extractData(this.identifierPath, data);
        if (!id) {
            console.warn("identifier not found")
        }
        return id.split(" ").join("-").trim();
    }

    private _clear(data: any[]) {
        if (!this._html) {
            return
        }
        if (Array.isArray(data) && this._html !== "") {
            data.forEach((ele) => this.removeNode(this.generateIdentifier(ele)));
        }
    }

    private _render(data: any[]) {
        if (!this._html) {
        }
        if (Array.isArray(data) && this._html !== "") {
            data.forEach((ele) => this.projectContent(ele, false));
        }
    }
}
