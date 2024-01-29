import {Attribute, EventBind, WebComponent} from "@commonweb/core";
import "./calendar";
import {CalendarMonthComponent, CalendarMonthInput} from "./calendar";
import {DataFetcher, DataFetcherConfiguration} from "@commonweb/data";
import {Table} from "@commonweb/components";

const hostURL = "http://localhost:8080";

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


@WebComponent({
    selector: `history-report-page`,
    // language=HTML
    template: `
        <div style=" display: flex;align-items: center; gap: 11px;justify-content: end;">
            <entity-form configurations='${JSON.stringify(filters)}'></entity-form>
            <bind-element from="tt-button[search]:(click)" to="entity-form:submit"></bind-element>
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
        <bind-element value="error" from="data-fetcher[data]:(request-failed)"
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
    `,
    style: ``
})
export class HistoryReportPage extends HTMLElement {

    @EventBind("data-fetcher[DATA]:request-success")
    public handleDataSuccess(data: any) {
        console.log({data})

        const days = data.detail.data;
        const calendar: CalendarMonthComponent = this.shadowRoot.querySelector("calendar-month");
        calendar.clear();
        // According to the date creat the range anyways
        calendar.month({
            index: 1,
            dayInputs: days.map((d, i) => {
                return {
                    index: new Date(d.date).getDate(),
                    template:
                    // language=HTML
                        `
                            <day-history
                                    orders='${JSON.stringify(d.orders)}'"'
                                    created="${d.ordersCreated}"
                                    completed=${d.ordersCompleted}></day-history>
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

const productsCOnfigurations = [
    {
        "label": "Order N°",
        "propertyName": "orderCode",
        "type": "string"
    },
    {
        "label": "Estatus",
        "propertyName": "status",
        "type": "string"
    },
    {
        "label": "Cantidad Productos",
        "propertyName": "products.length",
        "type": "string"
    },
    {
        "label": "Total",
        "propertyName": "totalPrice",
        "type": "currency"
    },

]

@WebComponent({
    selector: `day-history`,
    // language=HTML
    template: `

        <dialog>

        </dialog>
        <div class="pointer">
            <div></div>
            <div created>{{@host.created}} Creadas</div>
            <div completed>{{@host.completed}} Completadas</div>
        </div>
    `,
    // language=CSS
    style: `
        dialog{
            width: 48vw;
            border: none;
            outline: none;
            box-shadow: 0 1px 1px hsl(0deg 0% 0% / 0.075), 0 2px 2px hsl(0deg 0% 0% / 0.075), 0 4px 4px hsl(0deg 0% 0% / 0.075), 0 8px 8px hsl(0deg 0% 0% / 0.075), 0 16px 16px hsl(0deg 0% 0% / 0.075);
        }
        .pointer {
            cursor: pointer;
        }

        [created] {
            background-color: blue;
            color: white;
            text-align: end;
            padding: 0.1em;
            font-size: small
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

    @EventBind(".pointer:click")
    public handleDaySelected() {

        const dialog = this.shadowRoot.querySelector("dialog");
        dialog.innerHTML =
            // language=HTML
            `
                <div>
                    <h4>Lista de Ordenes</h4>
                    <go-table></go-table>
                </div>
            `;

        const table = dialog.querySelector("go-table") as Table;
        table.updateConfigurations(productsCOnfigurations);
        console.log(this.orders)
        table.setAttribute("data", JSON.stringify(this.orders));

        dialog.open ? dialog.close() : dialog.showModal();
    }

    public static get observedAttributes() {
        return ["completed", "cocked", "created", "orders"]
    }
}