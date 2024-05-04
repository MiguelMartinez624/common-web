import {Attribute, WebComponent} from "@commonweb/core";

@WebComponent({
    selector: `wc-tabs`,
    //language=HTML
    template: `
        <div style="display: flex;">
            <slot></slot>
        </div>
        <div>
            <slot name="content"></slot>
        </div>

        <div class="content">

        </div>
    `
})
export class TabsComponent extends HTMLElement {
    private cacheElements: any[] = [];

    connectedCallback() {
        const contents = [...this.querySelectorAll("[tab-case]")];
        contents.forEach(c => c.setAttribute("hidden", "true"));
        const tabs = [...this.querySelectorAll("wc-tab")];

        tabs.forEach((tab: TabComponent) => {

            if (tab.getAttribute("default")) {
                const contentForTab = contents.find((c) => c.getAttribute("tab-case") === tab.getAttribute("title"));
                if (contentForTab) {
                    contentForTab.removeAttribute("hidden");
                }
            }


            tab.addEventListener("tab-selected", () => {
                tabs.forEach((t: TabComponent) => {
                    t.toggle();
                    const contents = [...this.querySelectorAll("[tab-case]")];
                    const contentForTab = contents.find((c) => c.getAttribute("tab-case") === t.getAttribute("title"));

                    if (!contentForTab) {
                        return;
                    }

                    if (t.active && contentForTab) {
                        contentForTab.removeAttribute("hidden");
                    } else {
                        contentForTab.setAttribute("hidden", "true");
                    }

                });
            });
        });
    }


}


@WebComponent({
    selector: `wc-tab`,
    //language=HTML
    template: `
        <div toggle class="tab ">
            <bind-element

                    from="@parent:(click)"
                    to="@host:selectTab">
            </bind-element>

            <h4>{{@host:[title]}}</h4>
            <div toggle class="linea">
            </div>
        </div>
    `,
    //language=CSS
    style: `

        .tab {
            flex: 1;
            position: relative;
            text-align: center;
            border-bottom: 1px solid #ffffff8c;
            color: #ffffff8c;

        &
        h4 {
            padding: 0 1rem;
        }

        }


        .tab:has(.visible) {

            color: white;
        }

        .linea {
            position: absolute;
            bottom: 0;
            width: 0;
            height: 1px;
            background-color: #fff;
        }

        .linea.visible {
            transition: width 0.1s ease-in;

            width: 100%;
        }

        .hidden {
            display: none;
        }

        .selected {
            color: #80d674;
            fill: #80d674;
        }
    `
})
export class TabComponent extends HTMLElement {
    public title: string = "";

    public active: boolean;

    public selectTab() {
        this.dispatchEvent(new CustomEvent("tab-selected"));
    }

    public toggle() {
        (this as any)
            .query()
            .where(".linea")
            .then((element) => {
                this.active = !this.active;
                element.toggleClass("visible");

            })
            .catch(console.error)
            .build()
            .execute();
    }


    init() {
        //this.parentElement use this add the current selected

        const isDefault = this.getAttribute("default");
        if (isDefault) {
            this.toggle();

            // (this.parentElement as any).reflect(this.getContent())
        }

    }

}
