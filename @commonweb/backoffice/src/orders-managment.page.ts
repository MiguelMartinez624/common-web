import {Attribute, EventBind, EventBindAll, WebComponent} from "@commonweb/core";
import {DataFetcher, DataFetcherConfiguration} from "@commonweb/data";
import "@commonweb/forms";

const ordersRequestConfiguration: (status: string) => DataFetcherConfiguration = (status: string) => {
    return {
        "injectTo": [],
        "source": `https://pavlova-backend-natp7refrq-uc.a.run.app/orders/search`,
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
            "valuePath": "value",
            "labelPath": "label",
            "options": [
                {"label": "Seleccione una Ciudad", "value": null},
                {"label": "Barquisimeto", "value": "Barquisimeto"},
                {"label": "Caracas", "value": "Caracas"}
            ]
        }])}'>
            </entity-form>
            </div>
            <bind-element from="tt-button[search]:(click)" to="entity-form:submit"></bind-element>
            
            <tt-button search>Buscar</tt-button>
    </div>
    <bind-element value="loading" from="data-fetcher[PENDING]:(loading)" to="conditional-render-cases:[state]"></bind-element>

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

        
  


    `,
    selector: 'orders-page'
})
export class OrdersBoardComponent extends HTMLElement {

    connectedCallback() {
        this.fetchOrdersByDeliveryDate(new Date())
    }

    @EventBind("entity-form:submit")
    public searchOrders(ev) {
        this.fetchOrdersByDeliveryDate(ev.detail.values.deliveryDate)
    }

    private fetchOrdersByDeliveryDate(date: Date) {

        const pending = this.shadowRoot.querySelector("data-fetcher[PENDING]") as DataFetcher;
        pending.setAttribute("configurations", JSON.stringify(ordersRequestConfiguration("PEDNING")));
        pending.setAttribute("payload",
            JSON.stringify({
                "query": {
                    "clientId": "",
                    "date": null,
                    "status": "Created",
                    "deliveryDate": date,

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
                    "deliveryDate": date
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
                    "deliveryDate": date
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
                    source: `https://pavlova-backend-natp7refrq-uc.a.run.app/orders/${element.getAttribute('selector')}/dispatch-event`,
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
             <div class="field centered between"><span class="centered"> <span> Modo:</span>  <div mode></div></span> 
             <tt-icon  details class="pointer" icon="visibility"></tt-icon>
             <bind-element from="tt-icon[details]:(click)" to="modal-component:toggle"></bind-element>

              </div>
           </div>
           <div class="field rows"><span> Direccion:</span> <div address></div></div>
            
           <div>
              <h4 style="margin-top: 5px;margin-bottom: 5px;">Informacion de Contacto</h4>
              <div class="field "><span> Telefono:</span> <div phone></div></div>
              <div class="field "><span>Email: </span><div email></div></div>
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
        this.shadowRoot.querySelector("[mode]").innerHTML = data.delivery_mode === "PickUp" ? "<tt-icon icon='motorcycle'></tt-icon>" : "<tt-icon icon='storefront'></tt-icon>"
        this.shadowRoot.querySelector("[phone]").innerHTML = data.contact_info.phoneNumber;
        this.shadowRoot.querySelector("[email]").innerHTML = data.contact_info.email;
        const details = this.shadowRoot.querySelector("order-details-component");
        if (details) {
            details.setAttribute("data", JSON.stringify(data))
        }

    }


}

@WebComponent({
    template: `<pre></pre>`,
    selector: 'order-details-component'
})
export class OrderDetailsComponent extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["data"]
    }

    @Attribute("data")
    public data(order: any) {
        this.shadowRoot.querySelector("pre")
            .innerHTML = JSON.stringify(order, null, 2);
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

