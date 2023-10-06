import {Attribute, EventBind, FromStorage, WebComponent} from "../core";


@WebComponent({
    selector: 'hello-world',
    template: '<h4>Hello World!</h4>'
})
export class TestComponent extends HTMLElement {
}

@WebComponent({
    selector: 'hello-world-storage',
    template: '<h4>Hello</h4><'
})
export class TestComponentSubscribeToLocalStorage extends HTMLElement {

    @FromStorage("hello-world-key")
    public onValue(value: string) {
        this.shadowRoot.querySelector("h4").innerHTML += ` ${value}`;
    }
}


@WebComponent({
    selector: 'hello-world-event',
    template: '<h4>Hello World!</h4><button>Click Me</button>'
})
export class TestComponentWithEvents extends HTMLElement {

    @EventBind("button:click")
    public onNameChange(name: string) {
        this.shadowRoot.querySelector("h4").innerHTML += ` Just Got Clicked!`;
    }
}

@WebComponent({
    selector: 'hello-world-attr',
    template: '<h4>Hello World!</h4>'
})
export class TestComponentWithAttribute extends HTMLElement {

    static get observedAttributes() {
        return ["name"]
    }

    @Attribute("name")
    public onNameChange(name: string) {
        this.shadowRoot.querySelector("h4").innerHTML += ` ${name}`;
    }
}
