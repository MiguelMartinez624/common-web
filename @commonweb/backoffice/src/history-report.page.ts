import {Attribute, EventBind, WebComponent} from "@commonweb/core";
import "./calendar";
import {CalendarMonthComponent, CalendarMonthInput} from "./calendar";
import {DataFetcher, DataFetcherConfiguration} from "@commonweb/data";
import {EntityForm} from "@commonweb/forms";

// const hostURL = "http://localhost:8080";
const hostURL = "https://pavlova-backend-natp7refrq-uc.a.run.app"

const filters = [
    {"type": "date", "label": "Fecha Desde", "propertyName": "fromDate", "width": "200px"},
    {"type": "date", "label": "Fecha Hasta", "propertyName": "toDate", "width": "200px"},

    {
        "type": "select", "label": "Tienda", "propertyName": "store_id", "width": "200px",
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
                "query": {
                    "zones": []
                },
                "page": {
                    "page": 1,
                    "size": 100
                }
            }
        }
    }];


const productsEndpointConfig = {
    "method": "GET",
    "resultPath": "content",
    "source": `${hostURL}/products?page=1&size=100`,
    "filters": {
        "page": {
            "page": 1,
            "size": 100
        }
    }

}

@WebComponent({
    selector: `history-report-page`,
    // language=HTML
    template: `
        <h3>Reporte Diario de Ordenes</h3>

        <div style="display: flex;gap: 3rem;height: 87%;">
            <div style="flex: 0.7;">
                <go-card>
                    <div style="display: flex;flex-direction: column;overflow-y: auto;height: 100%;width: 100%">
                        <div style="display: flex;align-items: center; gap: 11px;justify-content: end;margin-bottom: 2rem;">
                            <div style=" display: flex;flex-wrap: wrap; gap: 10px">
                                <entity-form configurations='${JSON.stringify(filters)}'></entity-form>
                                <multi-select
                                        label-path="name"
                                        value-path="id"
                                        options-loader='${JSON.stringify(productsEndpointConfig)}'
                                        placeholder="Seleccione Producto"
                                        search-placeholder="Nombre Producto">
                                </multi-select>
                                <multi-select
                                        placeholder="Seleccione Estatus"
                                        search-placeholder="Estatus"
                                ></multi-select>
                                <bind-element from="tt-button[search]:(click)" to="entity-form:submit"></bind-element>
                            </div>
                            <tt-button search>Buscar</tt-button>
                        </div>

                        <data-fetcher DATA></data-fetcher>
                        <bind-element
                                input-path="detail.values"
                                from="entity-form:(submit)"
                                to="data-fetcher[DATA]:execute">
                        </bind-element>
                        <bind-element
                                value="loading"
                                from="tt-button[search]:(click)"
                                to="conditional-render-cases:[state]">
                        </bind-element>
                        <bind-element
                                value="error"
                                from="data-fetcher[data]:(request-failed)"
                                to="conditional-render-cases:[state]"></bind-element>
                        <bind-element
                                value="calendar"
                                from="data-fetcher[DATA]:(request-success)"
                                to="conditional-render-cases:[state]">
                        </bind-element>
                        <conditional-render-cases style="height: 100%;width: 100%" state="initial">
                            <div case="initial"></div>
                            <div case="loading">
                                <div style="display: flex;align-items: center;justify-content: center;height: 300px;flex-direction: column">
                                    <brand-icon-animated-component></brand-icon-animated-component>
                                    Cargando...
                                </div>
                            </div>
                            <div case="calendar">
                                <calendar-month></calendar-month>
                            </div>
                            <div style="height: 100%;width: 100%" case="error">
                                <div style="display: flex;align-items: center;justify-content: center;height: 300px;flex-direction: column">
                                    Lo sentimos! al parecer el imperio esta hackiando nuestros servidores!
                                </div>
                            </div>
                        </conditional-render-cases>
                    </div>
                </go-card>
            </div>
            <div style="flex: 0.3;">
                <go-card>
                    <div style="display: flex;flex-direction: column;overflow-y: auto;height: 100%;width: 100%"
                         container></div>
                </go-card>
            </div>
        </div>




    `,
    style: `go-card{height:100%}`
})
export class HistoryReportPage extends HTMLElement {

    @EventBind("calendar-month:day-selected")
    public handleDaySelected(ev: any): void {

        const container = this.shadowRoot.querySelector("[container]");
        container.innerHTML = "";
        ev.detail.data.orders.forEach(o => {
            const orderCard = document.createElement("order-card");
            orderCard.setAttribute("order", JSON.stringify(o));
            container.appendChild(orderCard);
        })

    }

    @EventBind("data-fetcher[DATA]:request-success")
    public handleDataSuccess(data: any) {
        const formFilter: EntityForm = this.shadowRoot.querySelector("entity-form");
        const {values} = formFilter.value()
        const days = data.detail.data;
        const toDate = new Date(values.toDate);
        const fromDate = new Date(values.fromDate);

        const calendar: CalendarMonthComponent = this.shadowRoot.querySelector("calendar-month");
        calendar.clear();
        // According to the date creat the range anyways
        calendar.month({
            start: fromDate,
            end: toDate,
            index: 0,
            dayInputs: days.map((d, i) => {
                return {
                    data: d,
                    date: new Date(d.date),
                    index: new Date(d.date).getDate(),
                    template:
                    // language=HTML
                        `
                            <day-history
                                    orders='${JSON.stringify(d.orders)}'
                                    created="${d.ordersCreated}"
                                    completed=${d.ordersCompleted}>
                            </day-history>
                        `
                }
            })
        } as CalendarMonthInput);

    }

    connectedCallback() {
        const fetcher = this.shadowRoot.querySelector("data-fetcher[DATA]") as DataFetcher;
        fetcher.setAttribute("configurations", JSON.stringify({
            source: `${hostURL}/report`,
            method: "POST",
        } as DataFetcherConfiguration))
    }
}

// Agregar a otro dia por fecha de entrega
// Agregar filtr5os ProductosId, Status
@WebComponent({
    selector: `day-history`,
    // language=HTML
    template: `
        <div class="pointer">
            <div created>{{@host.orders.length}} Ordenes</div>
        </div>
    `,
    // language=CSS
    style: `
        dialog {
            width: 48vw;
            border: none;
            outline: none;
            box-shadow: 0 1px 1px hsl(0deg 0% 0% / 0.075), 0 2px 2px hsl(0deg 0% 0% / 0.075), 0 4px 4px hsl(0deg 0% 0% / 0.075), 0 8px 8px hsl(0deg 0% 0% / 0.075), 0 16px 16px hsl(0deg 0% 0% / 0.075);
        }

        .pointer {
            cursor: pointer;
        }

        [created] {
            background-color: #0000ff5c;
            color: white;
            text-align: end;
            padding: 0.4em;
            font-size: medium;
        }

        [completed] {
            background-color: yellowgreen;
            color: white;
            text-align: end;
            padding: 0.1em;
            font-size: small
        }

        [cocked] {
            background-color: lightblue;
            color: white;
            text-align: end;
            padding: 0.1em;
            font-size: small
        }
    `
})
export class DayHistory extends HTMLElement {

    @Attribute("created")
    public created: number = 0;

    @Attribute("cocked")
    public cocked: number = 0;

    @Attribute("completed")
    public completed: number = 0;

    @Attribute("orders")
    public orders: any = [];


    public static get observedAttributes() {
        return ["completed", "cocked", "created", "orders"]
    }
}


@WebComponent({
    selector: `order-card`,

    template: `
         <div class="card">
            <div>{{@host.order.orderCode}}</div>    
            <div>
                <div><span>Status: </span> {{@host.order.status}}</div>    
                <div><span>Cantidad Productos: </span> {{@host.order.products.length}}</div>   
                 <div><span>Total: </span> {{@host.order.totalPrice}}</div> 
             </div> 
        </div>   
    `,
    style: `
        .card{
            margin:1rem 0;
            padding: 1rem;
            display: flex;
            box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;  
        }  `
})
export class OrderCard extends HTMLElement {
    public static get observedAttributes() {
        return ["order"]
    }

    @Attribute("order")
    public order: { status: string, products: any[], totalPrice: number, orderCode: string };
}