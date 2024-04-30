import {WebComponent} from "@commonweb/core";

@WebComponent({
    selector: `wc-tabs`,
    //language=HTML
    template: `
        <div style="display: flex;">
            <div pending toggle class=" tab">
                <h4>Pending</h4>
                <div toggle class="linea visible">
                    <bind-element
                            value="visible"
                            from="[pending]:(click)"
                            to="@parent:toggleUniqueClass">
                    </bind-element>

                </div>
                <bind-element value="pending" from="@parent:(click)"
                              to="[cases]:changeCase"></bind-element>
            </div>
            <div process toggle class="tab">
                <h4>Progress</h4>
                <div toggle class="linea">
                    <bind-element value="visible" from="[process]:(click)"
                                  to="@parent:toggleUniqueClass"></bind-element>
                    <bind-element value="process" from="[process]:(click)"
                                  to="[cases]:changeCase"></bind-element>
                </div>

            </div>
            <div toggle completed class="tab">
                <h4>Completed</h4>
                <div toggle class="linea">
                    <bind-element value="visible" from="[completed]:(click)"
                                  to="@parent:toggleUniqueClass"></bind-element>
                </div>
                <bind-element value="completed" from="[completed]:(click)"
                              to="[cases]:changeCase"></bind-element>

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

        .selected {
            color: #80d674;
            fill: #80d674;
        }
    `
})
export class TabsComponent extends HTMLElement {
}
