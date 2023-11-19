import {Attribute, EventBind, EventBindAll, WebComponent} from "@commonweb/core";

@WebComponent({
    style: ``,
    template: `
    <h1>Tablero Ordenes</h1>
    <draggable-list title="Pendiente">
 
        <li selector="item1" draggable="true">Orden Numero 1</li>
        <li selector="item2" draggable="true">Orden Numero 2</li>
                <li selector="item3" draggable="true">Orden Numero 3</li>

        <li selector="item4" draggable="true">Orden Numero 4</li>
        <li selector="item5" draggable="true">Orden Numero 5</li>

    </draggable-list>
    <draggable-list title="En Cocina">
           <div  selector="order-1" draggable="true" class="product">
              <h2>Producto 1</h2>
              <p>Precio: $100</p>
              <p>Cantidad: 1</p>
    </div>
     </draggable-list>
    <draggable-list title="Completada" id="done">
    </draggable-list>

    `,
    selector: 'orders-page'
})
export class OrdersBoardComponent extends HTMLElement {
    @EventBind("draggable-list:drop")
    public handleDrop(ev) {
        const selector = ev.dataTransfer.getData("text/plain");
        const list = this.shadowRoot.querySelector(`[selector="${selector}"]`);
        if (ev.target.nodeName === "DRAGGABLE-LIST") {
            ev.target.appendChild(list)
            ev.preventDefault()
        }
    }
}


@WebComponent({
    style: `
       :host {
          background: #f2f2f2;
          border: 1px solid #ccc;
          border-radius: 5px;
          height:500px;
          width: 30%;
          margin: 0 0.5%;
          display: inline-block;
          vertical-align: top;
         
}
.list{
     padding:10px;
}
.title {
    background: var(--bg-primary);
    padding: 1rem;
    border-bottom: 1px solid var(--border-line-color, rgba(28, 28, 28, 0.30));
    font-weight: 700;
    font-size: 22px;
}
    `,
    template: `
        <div class="title"></div>
        <div class="list">
            <slot></slot>
        </div>
    `,
    selector: 'draggable-list'
})
export class DraggableList extends HTMLElement {

    static get observedAttributes(): string[] {
        return ["title"]
    }

    @Attribute("title")
    public updateTitle(title: string) {
        this.shadowRoot.querySelector(".title").textContent = title
    }

    @EventBindAll("*[draggable]:dragstart")
    public appendDragStartHandler(event) {
        console.log(event)
        event.dataTransfer.setData("text/plain", event.target.getAttribute('selector'));

    }

    @EventBindAll("*[draggable]:drop")
    public appendDropHandler(event) {
        return false;
    }

    connectedCallback() {
        this
            .addEventListener('dragover', (event) => {
                event.preventDefault();
            });

    }
}