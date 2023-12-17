import {WebComponent} from "@commonweb/core";

export interface DayInput {
    index: number;
    contentElement?: string | HTMLElement;
    template?: string

}

@WebComponent({
    selector: `calendar-day`,
    template: `
        <div class="day-card">
            <div class="day"></div>
            <div class="content"></div>   
        </div>
    `,

    // language=CSS
    style: `
        .day-card {
            height: 12vh;
            border: 1px solid lightblue;
        }

        .day {
            text-align: end;
            padding: 0.3rem;
        }
    `
})
export class CalendarDayComponent extends HTMLElement {
    public day(day: number) {
        this.shadowRoot.querySelector(".day").innerHTML = day;
    }

    public events(inputs: DayInput) {
        const content = this.shadowRoot.querySelector(".content")

        // String means to be a html selector actually some will try to create a element from here
        if (typeof inputs.contentElement === "string") {
            const element = document.createElement(inputs.contentElement);
            content.appendChild(element);
        } else if (inputs.template) {
            content.innerHTML = inputs.template;
        }
    }
}