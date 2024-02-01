import {Attribute, WebComponent} from "@commonweb/core";
import {CalendarDayComponent, DayInput} from "./day.component";


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
      <div class="calendar-month">
        
      </div>
    `,
    style: `
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
        const container = this.shadowRoot.querySelector(".calendar-month");
        container.innerHTML = "";
    }

    @Attribute("month")
    public month(m: number | CalendarMonthInput) {
        const container = this.shadowRoot.querySelector(".calendar-month");

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
            console.log({m})
            const days: Date[] = getDates(m.start, m.end);
            console.log({days})
            days.forEach((d, i) => {
                const dayComponent: CalendarDayComponent = <CalendarDayComponent>document.createElement("calendar-day");
                dayComponent.day(d.getDate());
                const events = m.dayInputs.find((day) => day.date.getDate() === d.getDate() && d.getMonth() === day.date.getMonth());
                if (events) {
                    dayComponent.events(events);
                }
                dayComponent.addEventListener("click", () => this.handleDayClick(events))
                container.appendChild(dayComponent);
            })


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
                container.appendChild(dayComponent);
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