import {Attribute, WebComponent} from "@commonweb/core";
import {CalendarDayComponent, DayInput} from "./day.component";

export interface CalendarMonthInput {
    index: number;
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

                container.appendChild(dayComponent);
            }
        }
    }

    private getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }
}