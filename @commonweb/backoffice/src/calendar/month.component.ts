import {Attribute, WebComponent} from "@commonweb/core";
import {CalendarDayComponent, DayInput} from "./day.component";

const MONTH_NAMES = {
    0: "Enero",
    1: "Febrero",
    2: "Marzo",
    3: "Abril",
    4: "Mayo",
    5: "Junio",
    6: "Julio",
    7: "Agosto",
    8: "Septiembre",
    9: "Octubre",
    10: "Noviembre",
    11: "Diciembre"
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
}

export interface CalendarMonthInput {
    index: number;
    start?: Date;
    end?: Date;
    dayInputs: DayInput[]
}

@WebComponent({
    selector: `calendar-month`,
    template: `
      <div class="container">
        
      </div>
    `,
    style: `
    .container{
        display: flex;
        flex-direction: column;
        gap: 3rem;
    }
    .calendar-month {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-gap: 1em;
    }
`
})
export class CalendarMonthComponent extends HTMLElement {

    public static get observedAttributes() {
        return ["month"]
    }

    public clear(): void {
        const container = this.shadowRoot.querySelector(".container");
        container.innerHTML = "";
    }

    @Attribute("month")
    public month(m: number | CalendarMonthInput) {
        const container = this.shadowRoot.querySelector(".container");
        if (typeof m === "number") {
            const date = new Date();
            date.setMonth(m);
            for (let i = 0; i < this.getDaysInMonth(date.getFullYear(), date.getMonth()); i++) {
                const dayComponent: CalendarDayComponent = <CalendarDayComponent>document.createElement("calendar-day");
                dayComponent.day(i + 1);
                container.appendChild(dayComponent);
            }
        } else if (m.start && m.end) {
            // Will be default case
            // TODO refactorizar a componente por dia usar el for-each
            const daysOnStartMont = this.getDaysInMonth(m.start.getFullYear(), m.start.getMonth() + 1)
            const month = document.createElement("div");
            month.innerHTML = `<h3>${MONTH_NAMES[m.start.getMonth()]}</h3> <div class="calendar-month"></div>`
            for (let i = 0; i < daysOnStartMont; i++) {
                const dayComponent: CalendarDayComponent = <CalendarDayComponent>document.createElement("calendar-day");
                dayComponent.day(i + 1);
                const events = m.dayInputs.find((day) => day.date.getDate() === i + 1 && m.start.getMonth() === day.date.getMonth());
                if (events) {
                    dayComponent.events(events);
                }
                dayComponent.addEventListener("click", () => this.handleDayClick(events))
                month.querySelector(".calendar-month").appendChild(dayComponent);
            }
            container.appendChild(month);
            // If end month is difent then set a new list
            if (m.start.getMonth() !== m.end.getMonth()) {
                const nextMonth = document.createElement("div");
                nextMonth.innerHTML = `<h3>${MONTH_NAMES[m.end.getMonth()]}</h3> <div class="calendar-month"></div>`
                const daysOnEndMont = this.getDaysInMonth(m.end.getFullYear(), m.end.getMonth() + 1)
                for (let i = 0; i < daysOnEndMont; i++) {
                    const dayComponent: CalendarDayComponent = <CalendarDayComponent>document.createElement("calendar-day");
                    dayComponent.day(i + 1);
                    const events = m.dayInputs.find((day) => day.date.getDate() === i + 1 && m.end.getMonth() === day.date.getMonth());
                    if (events) {
                        dayComponent.events(events);
                    }
                    dayComponent.addEventListener("click", () => this.handleDayClick(events))
                    nextMonth.querySelector(".calendar-month").appendChild(dayComponent);
                }

                container.appendChild(nextMonth);

            }

        } else {
            const date = new Date();
            date.setMonth(m.index);

            for (let i = 0; i < this.getDaysInMonth(date.getFullYear(), date.getMonth()); i++) {
                const dayComponent: CalendarDayComponent = <CalendarDayComponent>document.createElement("calendar-day");
                dayComponent.day(i + 1);
                const events = m.dayInputs.find((day) => day.index === i);
                if (events) {
                    dayComponent.events(events);
                }
                dayComponent.addEventListener("click", () => this.handleDayClick(events))
                container.querySelector(".calendar-month").appendChild(dayComponent);
            }
        }
    }

    public handleDayClick(events: DayInput) {
        this.dispatchEvent(new CustomEvent("day-selected", {detail: events}))
    }

    private getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }
}