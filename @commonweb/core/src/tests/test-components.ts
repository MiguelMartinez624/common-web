import {Attribute, EventBind, EventBindAll, FromStorage, WebComponent} from "..";


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

@WebComponent({
    style: `
       * {font-family: 'Segoe UI';}
       li {
          list-style: none;
          padding: 5px;
          background: #f5f5f5;
          border-radius: 5px;
          color:black;
          height:100px;
          margin: 0 0 5px;
        }


#board div h3 {display: inline-block; width: 30%; margin: 1%; text-align: center;}
    `,
    template: `
        <h1>Tablero Ordenes</h1>
<div id="board">
    <div>
      <h3>Pendiente</h3><h3>En Cocina</h3><h3>Despachada</h3>
    </div>
    <draggable-list>
        <li selector="item1" draggable="true">Orden Numero 1</li>
        <li selector="item2" draggable="true">Orden Numero 2</li>
        <li selector="item3" draggable="true">Orden Numero 3</li>
        <li selector="item4" draggable="true">Orden Numero 4</li>
        <li selector="item5" draggable="true">Orden Numero 5</li>

    </draggable-list>
    <draggable-list>
        
     </draggable-list>
    <draggable-list id="done">
    </draggable-list>
</div>
    `,
    selector: 'orders-page'
})
export class StatusListComponent extends HTMLElement {
    @EventBindAll("draggable-list:drop")
    public handleDrop(ev) {
        const selector = ev.dataTransfer.getData("text/plain");
        console.log({selector})
        const list = this.shadowRoot.querySelector(`[selector="${selector}"]`);
        ev.target.appendChild(list)
        ev.preventDefault()

    }
}


@WebComponent({
    style: `
       :host {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  height:500px;
  width: 29%;
  margin: 0 0.5%;
  display: inline-block;
  vertical-align: top;
}
    `,
    template: `
        <slot></slot>
    `,
    selector: 'draggable-list'
})
export class OrderCardComponent extends HTMLElement {
    @EventBindAll("*[draggable]:dragstart")
    public appendDragStartHandler(event){
        console.log(event)
        event.dataTransfer.setData("text/plain", event.target.getAttribute('selector'));

    }

    @EventBindAll("*[draggable]:drop")
    public appendDropHandler(event){
        return false;
    }

    connectedCallback() {
        this
            .addEventListener('dragover', (event) => {
                event.preventDefault();
            });

    }
}
