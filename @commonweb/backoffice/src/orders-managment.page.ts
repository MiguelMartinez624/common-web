import {Attribute, EventBind, EventBindAll, WebComponent} from "@commonweb/core";
import {DataFetcher, DataFetcherConfiguration} from "@commonweb/data";
import "@commonweb/forms";

const hostURL = "https://pavlova-backend-natp7refrq-uc.a.run.app";
//const hostURL = "http://localhost:8080"

const ordersRequestConfiguration: (status: string) => DataFetcherConfiguration = (status: string) => {
    return {
        "injectTo": [],
        "source": `${hostURL}/orders/search`,
        "auto": false,
        "method": "POST",
        "fieldType": "set",
        resultPath: "content"
    }
}

@WebComponent({
    style: `:host{display:flex;flex-direction:column;} draggable-list{flex:1;}`,
    template: `
    <h3>Tablero Ordenes</h3>
    <div style="
        display: flex;
        align-items: center;
        gap: 11px;justify-content: end;">
        <div>
        <entity-form configurations='${JSON.stringify([
        {"type": "date", "label": "Fecha de Entrega", "propertyName": "deliveryDate", "width": "200px"},
        {
            "type": "select", "label": "Ciudad", "propertyName": "city", "width": "200px",
            "valuePath": "id",
            "labelPath": "name",
            "options": [
                {"name": "Seleccione una Sucursal", "id": null},

            ],
            "optionsLoader": {
                "method": "POST",
                "resultPath": "content",
                "source": `${hostURL}/branches/search`,
                "filters": {
                    "page": {
                        "page": 1,
                        "size": 100
                    }
                }
            }
        }])}'>
            </entity-form>
            </div>
            <bind-element from="tt-button[search]:(click)" to="entity-form:submit"></bind-element>
            
            <tt-button search>Buscar</tt-button>
    </div>
    <bind-element value="loading" from="tt-button[search]:(click)" to="conditional-render-cases:[state]"></bind-element>

    <bind-element value="board" from="data-fetcher[PENDING]:(request-success)" to="conditional-render-cases:[state]"></bind-element>

    <conditional-render-cases style="height: 100%;width: 100%" state="initial">
        <div case="initial">
            <div  style="display: flex;align-items: center;justify-content: center;height: 300px;">
                <h2> Seleccione la fecha de delivery y presione Buscar</h2>
            </div>
        </div>
        <div case="loading">
            <div  style="display: flex;align-items: center;justify-content: center;height: 300px;flex-direction: column">
               <brand-icon-animated-component></brand-icon-animated-component>
               Cargando...
            </div> 
        </div>
          <div case="board">
        <div  style="display: flex;">
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
    </div>
     </div>
    </conditional-render-cases>

        

<snackbar-component>
    No puede realizar cambio de estatus
</snackbar-component>

    `,
    selector: 'orders-page'
})
export class OrdersBoardComponent extends HTMLElement {
    private poolingInterval: number;

    disconnectedCallback() {
        window.clearInterval(this.poolingInterval);
    }

    @EventBind("entity-form:submit")
    public searchOrders(ev) {
        const filters = ev.detail.values;
        this.fetchOrdersByDeliveryDate(filters)
        window.clearInterval(this.poolingInterval);
        this.poolingInterval = setInterval(() => this.fetchOrdersByDeliveryDate(filters), 30000)
    }

    private fetchOrdersByDeliveryDate(data: { deliveryDate, city }) {

        const pending = this.shadowRoot.querySelector("data-fetcher[PENDING]") as DataFetcher;
        pending.setAttribute("configurations", JSON.stringify(ordersRequestConfiguration("PEDNING")));
        pending.setAttribute("payload",
            JSON.stringify({
                "query": {
                    "clientId": "",
                    "date": null,
                    "status": "Created",
                    "deliveryDate": data.deliveryDate,
                    "city": data.city === "null" ? null : data.city

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
                    "status": "InPreparation",
                    "deliveryDate": data.deliveryDate,
                    "city": data.city === "null" ? null : data.city
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
                    "status": "Completed",
                    "deliveryDate": data.deliveryDate,
                    "city": data.city === "null" ? null : data.city
                },
                "page": {
                    "page": 1,
                    "size": 100
                }
            }));
        completed.execute({});
        pending.execute({});
        preparation.execute({});


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
                fetcher.setAttribute("configurations", JSON.stringify({
                    source: `${hostURL}/orders/${element.getAttribute('selector')}/dispatch-event`,
                    method: "POST",
                } as DataFetcherConfiguration))

                fetcher.setAttribute("payload", JSON.stringify({
                    event_type: listTarget.getAttribute("status"),
                    payload: {}
                }));
                fetcher.execute({});
                fetcher.addEventListener("request-success", () => {
                    listTarget.shadowRoot.querySelector("slot").appendChild(element);
                    ev.preventDefault();
                });

                fetcher.addEventListener("request-failed", () => {
                    this.shadowRoot.querySelector("snackbar-component").toggle();

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
          margin: 0 0.5%;
          display: inline-block;
          vertical-align: top;
         
        }
        .list{
            overflow-y: scroll;
            height: 89%;
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
        this.shadowRoot.querySelector("slot").innerHTML = "";
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
    style: `
    :host:hover{
        background:lightcyan;
    }
    
    :host{
        margin: 5px;
        cursor:pointer;
        border-bottom: 1px solid var(--border-line-color, rgba(28, 28, 28, 0.30));
        display:flex;
        flex-direction:column;
        padding: 1rem;
        background:var( --bg-primary, #FFFFFF);
    }
    .field{
        display: flex;
        gap: 5px;
        margin-top:5px;
    }
    .centered{   display:flex;     align-items: center;gap:7px;}
    .field > span {
        font-weight:500;
    }
    .rows{
        flex-direction:column;
    }    
    tt-icon{
        font-size:30px;
    }
    .between{justify-content: space-between;}
    .pointer{cursor:pointer}
    `,
    template: `
            <modal-component>
              <order-details-component></order-details-component>
            </modal-component>
        <div>
           <div>
            <div class="field centered between"><span class="centered"> <span> Codigo:</span>  <div code></div></span>  </div>

             <div class="field centered between"><span class="centered"> <span> Modo:</span>  <div mode></div></span> 
              <bind-element from="tt-icon[details]:(click)" to="modal-component:toggle"></bind-element>
             <tt-icon  details class="pointer" icon="visibility"></tt-icon>
            

              </div>
           </div>
            <ul productList> </ul>
           
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
        this.shadowRoot.querySelector("[code]").innerHTML = data.orderCode;
        this.shadowRoot.querySelector("[mode]").innerHTML = data.deliveryMode === "PickUp" ? "<tt-icon icon='motorcycle'></tt-icon>" : "<tt-icon icon='storefront'></tt-icon>"
        data.productList.forEach((p) => {
            const productItem = document.createElement("li");
            productItem.innerHTML = p.name + " x" + p.quantity
            this.shadowRoot.querySelector("[productList]").appendChild(productItem)
        });
        const details = this.shadowRoot.querySelector("order-details-component");
        if (details) {
            details.setAttribute("data", JSON.stringify(data))
        }

    }


}

@WebComponent({
    style: `:host{display:flex;justify-content:space-between;border-bottom: 1px solid #7070708a;padding:1em 0px;}`,
    template: `
       
               <div product-name>Cacaguate</div>
               <div style="display: flex;gap:1em;">Cantidad:  <div style="font-weight: bold" quantity>2</div></div>
       
    `,
    selector: 'product-item-component'
})
export class ProductItemComponent extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["data"]
    }

    @Attribute("data")
    public data(order: any) {
        this.shadowRoot.querySelector("[product-name]").innerHTML = order.name;

        this.shadowRoot.querySelector("[quantity]").innerHTML = order.quantity;
    }

}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

@WebComponent({
    template: `
       <div style="display: flex;height: 100%">
    <div class="detail-section right">
        <div>
            <h4 style="margin-top: 5px;margin-bottom: 0px;">Codigo de Orden</h4>
            <div code></div>
        </div>
        <div>
            <div class="field centered between"><span class="centered"> <span> Modo:</span>  <div mode></div></span>
            </div>
        </div>
        <div class="field rows">
          <h4 style="margin-top: 5px;margin-bottom: 0px;">Direccion</h4>
            <div address></div>
        </div>

        <div>
            <h4 style="margin-top: 5px;margin-bottom: 5px;">Informacion de Contacto</h4>
            <div class="field "><span> Telefono:</span>
                <div phone></div>
            </div>
            <div class="field "><span>Email: </span>
                <div email></div>
            </div>
        </div>
    
    <h4>Items</h4>
    <div style="margin-top: 10px" products>
    </div>

    <div style="display:flex;justify-content: end;margin-top: 1em" total></div>
</div>
    <div class="detail-section">
    <h3>Recibo</h3>
    <div style="display: flex;justify-content: center;">
        <img style="width: 400px;
    height: 250px" receipt src="" alt="receipt">
    </div>
    </div>
</div>
`,
    selector: 'order-details-component',
    style: `
    .right{border-right:1px solid var(--border-line-color, rgba(28, 28, 28, 0.30))}
    .detail-section{flex:1;padding:1em}
    .field{display: flex; gap: 5px; margin-top:5px;}
    .centered{   display:flex;     align-items: center;gap:7px;}
    .field > span {font-weight:500; }
    .rows{ flex-direction:column;  }    
    tt-icon{ font-size:30px; }
    .between{justify-content: space-between;}
    .pointer{cursor:pointer}
    `
})
export class OrderDetailsComponent extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["data"]
    }

    @Attribute("data")
    public data(order: any) {
        this.shadowRoot.querySelector("[code]").innerHTML = order.orderCode;

        this.shadowRoot.querySelector("[address]").innerHTML = order.shippingAddress.address;
        this.shadowRoot.querySelector("[mode]").innerHTML = order.deliveryMode === "PickUp" ? "<tt-icon icon='motorcycle'></tt-icon>" : "<tt-icon icon='storefront'></tt-icon>"
        this.shadowRoot.querySelector("[phone]").innerHTML = order.contactInfo.phoneNumber;
        this.shadowRoot.querySelector("[email]").innerHTML = order.contactInfo.email;
        let total = 0;
        order.productList.forEach((p) => {
            const productItem = document.createElement("product-item-component");
            total += (p.price * p.quantity) / 100;
            productItem.data(p)
            this.shadowRoot.querySelector("[products]").appendChild(productItem)
        });

        this.shadowRoot.querySelector("[total]").innerHTML = formatter.format(total);

        const createEvent = order.eventHistory.find(ev => ev.type === "created");
        this.shadowRoot.querySelector("[receipt]").src = createEvent.payload.receiptURL
    }

}

@WebComponent({
    template: `
    <div main  class="hide">
             <div class="modal-overlay">   </div>
            <div class="modal-content">
                <span class="close">&times;</span>
                <slot></slot> 
            </div>
      </div>
        `,
    selector: 'modal-component',
    style: `
    .modal-overlay{
        position: fixed; /* Stay in place */
        z-index: 1; /* Sit on top */
        padding-top: 100px; /* Location of the box */
        left: 0;
        top: 0;
      width: 100%; /* Full width */
      height: 100%; /* Full height */
      overflow: auto; /* Enable scroll if needed */
      background-color: rgb(0,0,0); /* Fallback color */
      background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    }
    .modal-content{
         position: fixed;
        z-index: 2;
        background-color: var(--bg-primary);
        margin: auto;
        padding: 20px;
        border: 1px solid #888;
        width: 65%;
        top: 10%;
        left: 16%;
        height:60%;
        overflow-y:auto;
    }
    .close {
      color: #aaaaaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }
    .close:hover,
        .close:focus {
          color: #000;
          text-decoration: none;
          cursor: pointer;
    }
      .hide{
        display:none;
      }
    `
})
export class ModalComponent extends HTMLElement {

    @EventBind(".close:click")
    public toggleC() {
        this.shadowRoot.querySelector("[main]").classList.toggle("hide")
    }

    @EventBind(".modal-overlay:click")
    public toggle() {
        this.shadowRoot.querySelector("[main]").classList.toggle("hide")
    }
}

