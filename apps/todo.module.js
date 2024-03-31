window.RegisterWebComponent({
    selector: "todos-module",
    // language=HTML
    template: `
        <div>
            <h4 class="no-margin">Todo List</h4>
        </div>


        <local-storage-value
                property-matcher="date"
                item-key="date"
                data-list
                key="demo-todo-list">
        </local-storage-value>
        <bind-element input-path="detail" from="[data-list]:(appended-value)" to="[expenses-list]:push"></bind-element>
        <bind-element input-path="detail" from="[data-list]:(item-removed)"
                      to="[expenses-list]:removeItem">
        </bind-element>
        <bind-element input-path="detail" from="[data-list]:(updated-value)" to="[expenses-list]:replace">
        </bind-element>
        <style>
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
        </style>
        <div style="overflow: auto;height: 80vh;padding: 3px">
            <div style="display: flex;">
                <div pending toggle class="tab">
                    <h4>Pending</h4>
                    <div toggle class="linea">
                        <bind-element value="visible" from="[pending]:(click)"
                                      to="@parent:toggleUniqueClass"></bind-element>
                    </div>

                </div>
                <div process toggle class="tab">
                    <h4>Progress</h4>
                    <div toggle class="linea">
                        <bind-element value="visible" from="[process]:(click)"
                                      to="@parent:toggleUniqueClass"></bind-element>
                    </div>

                </div>
                <div toggle completed class="tab">
                    <h4>Completed</h4>
                    <div toggle class="linea">
                        <bind-element value="visible" from="[completed]:(click)"
                                      to="@parent:toggleUniqueClass"></bind-element>
                    </div>

                </div>
            </div>
        </div>
    `,
    // language=CSS
    style: `

        .no-margin {
            margin: 0;
        }

        .hidden {
            display: none;
        }


        .collapse {
            height: 0 !important;
            padding: 0;
            overflow: hidden;
        }

    `,
})
    .build();
