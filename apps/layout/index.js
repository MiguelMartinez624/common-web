window.RegisterWebComponent({
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
            bottom: 0;
            width: -webkit-fill-available;
            height: 100%;
            left: 0;
            transition: all 0.2s ease-out;
            z-index: 2;
        }

        .collapse {
            height: 0 !important;
            padding: 0;
            overflow: hidden;
        }
    `
})
    .with_method('close', function () {
        this.shadowRoot.querySelector("[toggle]").toggleClass("collapse");
    })
    .build();


window.RegisterWebComponent({
    selector: `cw-card`,
    //language=HTML
    template: `
        <div class="card">
            <div>
                <slot slot="header"></slot>
            </div>
            <slot></slot>
        </div>
    `,
    //language=CSS
    style: `
        .card {
            height: calc(100% - 55px);
            padding: 0.5rem;
            outline-offset: 4px;
            outline: var(--card-outline);
            border-radius: 5px;
            background: var(--card-bg);
            color: var(--card-fc);
        }
    `
})
    .build()
