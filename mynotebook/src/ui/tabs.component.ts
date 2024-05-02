import {WebComponent} from "@commonweb/core";

@WebComponent({
    selector: `wc-tabs`,
    //language=HTML
    template: `
        <div style="display: flex;">
            <slot></slot>
        </div>
    `
})
export class TabsComponent extends HTMLElement {
    public tabs: string[] = ["Comments", "History"];

    public tabChange(value: string) {
        console.log({value})
    }

    connectedCallback() {
        const tabs = [...this.querySelectorAll("wc-tab")];

        tabs.forEach((tab: TabComponent) => {


            tab.addEventListener("tab-selected", () => {
                tabs.forEach((t: any) => t.toggle());
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
        <div class="hidden">
            <slot></slot>
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

    public selectTab() {
        this.dispatchEvent(new CustomEvent("tab-selected"));
    }

    public toggle() {
        (this as any)
            .query()
            .where(".linea")
            .then((element) => {
                element.toggleClass("visible")
            })
            .catch(console.error)
            .build()
            .execute();
    }

    connectedCallback() {
        const isDefault = this.getAttribute("default");
        if (isDefault) {
            this.toggle();
        }

    }

}
