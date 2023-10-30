import {findNodeOnUpTree, WebComponent} from "@commonweb/core";

export enum EntityWriterPropsName {
    For = "for",
    Endpoint = "endpoint"
}

// EntityWriter shoul bne change to FOrmOrchestator and should hjandle form pushing cleaning
// and event emitted, this should be configurable some how
@WebComponent({
    selector: "data-writer",
    template: ``
})
export class DataWriter extends HTMLElement {


    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name as EntityWriterPropsName) {
            case EntityWriterPropsName.For:
                const sections = newValue.split(":");
                const element = document.querySelector(sections[0]);
                if (element) {
                    element[sections[1]] = this.execute.bind(this);
                } else {
                    // TODO remove the for as this component make a app call or a method binding

                    // Component
                    const ele = this.parentElement;
                    if (ele) {
                        ele[sections[1]] = this.execute.bind(this);
                    } else {
                        console.log("No found on parent")
                    }
                }
                break;
        }
    }

    execute(values) {
        return fetch(this.getAttribute('endpoint'), {
            method: this.getAttribute("method") || 'POST',
            body: values ? JSON.stringify(values) : '',
        })
    }

    static get observedAttributes() {
        return [EntityWriterPropsName.For, EntityWriterPropsName.Endpoint];
    }
}
