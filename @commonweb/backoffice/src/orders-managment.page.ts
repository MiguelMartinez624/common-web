import {Attribute, EventBind, EventBindAll, WebComponent} from "@commonweb/core";
import {DataFetcher, DataFetcherConfiguration} from "@commonweb/data";

const ordersRequestConfiguration: (status: string) => DataFetcherConfiguration = (status: string) => {
    return {
        "injectTo": [],
        "source": `http://localhost:8080/orders/search`,
        "auto": true,
        "method": "POST",
        "fieldType": "set",
        resultPath: "content"
    }
}

@WebComponent({
    style: `:host{}`,
    template: `
    <h1>Tablero Ordenes</h1>
    <data-fetcher PENDING></data-fetcher>
     <bind-element 
         input-path="detail.data.content" 
         from="data-fetcher[PENDING]:(request-success)"
          to="draggable-list[PENDING]:appendMany">
    </bind-element>
    <draggable-list
     status="Created"
     element-list="order-card-component" PENDING title="Pendiente"></draggable-list>
    
    <data-fetcher IN_PREPARATION></data-fetcher>
    <bind-element 
         input-path="detail.data.content" 
         from="data-fetcher[IN_PREPARATION]:(request-success)"
          to="draggable-list[IN_PREPARATION]:appendMany">
    </bind-element>
    <draggable-list
     status="InitPreparation"
     element-list="order-card-component" IN_PREPARATION title="En Cocina"></draggable-list>
    
    <data-fetcher COMPLETED></data-fetcher>
    <bind-element 
    
         input-path="detail.data.content" 
         from="data-fetcher[COMPLETED]:(request-success)"
          to="draggable-list[COMPLETED]:appendMany">
    </bind-element>
    <draggable-list  
    status="Completed" 
    element-list="order-card-component" COMPLETED title="Completada"></draggable-list>

    `,
    selector: 'orders-page'
})
export class OrdersBoardComponent extends HTMLElement {

    connectedCallback() {

        const pending = this.shadowRoot.querySelector("data-fetcher[PENDING]") as DataFetcher;
        pending.setAttribute("configurations", JSON.stringify(ordersRequestConfiguration("PEDNING")));
        pending.setAttribute("payload",
            JSON.stringify({
                "query": {
                    "clientId": "",
                    "date": null,
                    "status": "Created"
                },
                "page": {
                    "page": 1,
                    "size": 100
                }
            }));

        const preparation = this.shadowRoot.querySelector("data-fetcher[IN_PREPARATION]") as DataFetcher;
        preparation.setAttribute("configurations", JSON.stringify(ordersRequestConfiguration("IN_PREPARATION")));
        preparation.setAttribute("payload",
            JSON.stringify({
                "query": {
                    "clientId": "",
                    "date": null,
                    "status":"InPreparation"
                },
                "page": {
                    "page": 1,
                    "size": 100
                }
            }));
        const completed = this.shadowRoot.querySelector("data-fetcher[COMPLETED]") as DataFetcher;
        completed.setAttribute("configurations", JSON.stringify(ordersRequestConfiguration("COMPLETED")));
        completed.setAttribute("payload",
            JSON.stringify({
                "query": {
                    "clientId": "",
                    "date": null,
                    "status": "Completed"
                },
                "page": {
                    "page": 1,
                    "size": 100
                }
            }));
    }

    @EventBind("draggable-list:drop")
    public handleDrop(ev) {
        const selector = ev.dataTransfer.getData("text/plain");
        if (ev.target.nodeName !== "DRAGGABLE-LIST") {
            return;
        }
        const listTarget = ev.target;
        this.shadowRoot.querySelectorAll("draggable-list").forEach((list) => {
            const element = list.shadowRoot.querySelector(`[selector="${selector}"]`);
            if (element) {


                const fetcher = document.createElement("data-fetcher") as DataFetcher;
                fetcher.setAttribute("configurations",JSON.stringify({
                    source:`http://localhost:8080/orders/${element.getAttribute('selector')}/dispatch-event`,
                    method:"POST",
                } as DataFetcherConfiguration))

                fetcher.setAttribute("payload",JSON.stringify({
                    event_type:listTarget.getAttribute("status"),
                    payload:{}
                }));
                fetcher.execute({});

                fetcher.addEventListener("request-success",()=>{
                    listTarget.shadowRoot.querySelector("slot").appendChild(element);
                    ev.preventDefault();
                })

            }
        });


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
           overflow: scroll;
            height: 100%;
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
        return ["title", "element-list"]
    }

    public appendMany(items: any[]) {
        console.log({items})
        const elementListName = this.getAttribute("element-list");
        items.forEach((item) => {
            const element = document.createElement(elementListName);
            element.setAttribute("draggable", "true");
            element.setAttribute("selector", item.id);
            element.data(item);

            element.addEventListener("dragstart", (event) => {
                event.dataTransfer.setData("text/plain", event.target.getAttribute('selector'));
            });

            this.shadowRoot.querySelector("slot")
                .appendChild(element);



        })
    }

    @Attribute("title")
    public updateTitle(title: string) {
        this.shadowRoot.querySelector(".title").textContent = title
    }

    @EventBindAll("*[draggable]:dragstart")
    public appendDragStartHandler(event) {
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

@WebComponent({
    style: `:host{
        border-bottom: 1px solid var(--border-line-color, rgba(28, 28, 28, 0.30));
        display:flex;
        flex-direction:column;
        padding: 1rem;
        background:var( --bg-primary, #FFFFFF);
    }
    .field{display:flex}
    `,
    template: `
        <div>
           <div class="field">Direccion: <div address></div></div>
           <div class="field">Modo:  <div mode></div></div>
            
             <div>
             <div class="field">Telefono: <div phone></div></div>
              <div class="field">Email: <div email></div></div>
             
             </div>
        </div>
        
    `,
    selector: 'order-card-component'
})
export class OrderCardComponent extends HTMLElement {

    static get observedAttributes(): string[] {
        return ["data", "element-list"]
    }


    @Attribute("data")
    public data(data: any) {
        this.shadowRoot.querySelector("[address]").innerHTML = data.shipping_address.address;
        this.shadowRoot.querySelector("[mode]").innerHTML = data.delivery_mode;
        this.shadowRoot.querySelector("[phone]").innerHTML = data.contact_info.phoneNumber;
        this.shadowRoot.querySelector("[email]").innerHTML =data.contact_info.email;

    }


}