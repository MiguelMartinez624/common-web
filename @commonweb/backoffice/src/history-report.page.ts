import {Attribute, WebComponent} from "@commonweb/core";
import "./calendar";
import {CalendarMonthComponent, CalendarMonthInput} from "./calendar";

@WebComponent({
    selector: `history-report-page`,
    template: `
        <calendar-month></calendar-month>
    `,
    style: ``
})
export class HistoryReportPage extends HTMLElement {
    connectedCallback() {
        const calendar: CalendarMonthComponent = this.shadowRoot.querySelector("calendar-month");
        calendar.setAttribute("month", JSON.stringify({
            index: 12,
            dayInputs: [
                {
                    index: 12,
                    // language=HTML
                    template: "<day-history cocked='24' completed='20'></day-history>"
                },
                {
                    index: 13,
                    // language=HTML
                    template: "<day-history cocked='24' completed='20'></day-history>"
                },
                {
                    index: 11,
                    // language=HTML
                    template: "<day-history cocked='24' completed='20'></day-history>"
                },
                {
                    index: 14,
                    // language=HTML
                    template: "<day-history cocked='24' completed='20'></day-history>",

                    // language=HTML
                    detailsElement:"<div>Esto son los detalles tio no te jode?</div>"
                },
                {
                    index: 15,
                    // language=HTML
                    template: "<day-history cocked='24' completed='20'></day-history>"
                },
                {
                    index: 9,
                    // language=HTML
                    template: "<day-history cocked='24' completed='20'></day-history>"
                }
            ]
        } as CalendarMonthInput))
    }
}

@WebComponent({
    selector: `day-history`,
    // language=HTML
    template: `
        <div>
            <div></div>
            <div cocked></div>
            <div completed></div>
        </div>
    `,
    // language=CSS
    style: `
        [completed]{background-color: yellowgreen;color:white;text-align: end;padding: 0.1em;font-size: small}
        [cocked]{background-color: lightblue;color:white;text-align: end;padding: 0.1em;font-size: small}
    `
})
export class DayHistory extends HTMLElement {

    public static get observedAttributes() {
        return ["completed","cocked"]
    }
    @Attribute("cocked")
    public cocked(value: number) {
        this.shadowRoot.querySelector("[cocked]").innerHTML = `${value} Preparadas`;
    }
    @Attribute("completed")
    public completed(completed: number) {
        this.shadowRoot.querySelector("[completed]").innerHTML = `${completed} Completadas`;
    }

}