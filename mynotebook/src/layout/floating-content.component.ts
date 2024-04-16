import {WebComponent} from "@commonweb/core";

@WebComponent({
    selector: `floating-content`,
    // language=HTML
    template: `
        <button toggle add class="floating-action">
            <slot name="trigger"></slot>
            <bind-element
                    value="collapse"
                    from="button[add]:(click)" to=".content:toggleClass">
            </bind-element>
            <bind-element
                    value="hidden"
                    from="button[add]:(click)" to="button[add]:toggleClass">
            </bind-element>
        </button>

        <div toggle class="content collapse">
            <cw-close-icon>
                <bind-element value="hidden" from="@parent:(click)" to="button[add]:toggleClass"></bind-element>
                <bind-element value="collapse" from="@parent:(click)" to=".content:toggleClass"></bind-element>
            </cw-close-icon>
            <slot name="content"></slot>
        </div>
    `,
    //language=CSS
    style: `

        cw-close-icon {
            position: absolute;
            right: 20px;
            top: 10px;
        }

        .hidden {
            display: none
        }

        .floating-action {
            background: none;
            border: none;
            position: absolute;
            bottom: 0px;
            right: 20px;

        }

        .content {
            position: fixed;
            top: 0;
            width: -webkit-fill-available;
            height: calc(100% - 50px);
            left: 0;
            transition: all 0.2s ease-out;
            z-index: 2;
            overflow: auto;
        }

        .collapse {
            height: 0 !important;
            padding: 0;
            overflow: hidden;
        }
    `
})
export class FloatingContentComponent extends HTMLElement {

    close() {
        (this.shadowRoot.querySelector(".content") as unknown as any)
            .toggleClass("collapse");
    }

    toggle() {
        console.log("TOGGE");
        (this.shadowRoot.querySelector(".content") as unknown as any)
            .toggleClass("collapse");
        (this.shadowRoot.querySelector("button") as unknown as any)
            .toggleClass("hidden");
    }
}
