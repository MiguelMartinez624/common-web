window.RegisterWebComponent({
    selector: "todos-module",
    // language=HTML
    template: `
        <div>
            <h4>Transaction List</h4>
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
            
            .tab:has(.visible){
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

        <div class="barra-acciones">
            <button home class="btn-accion">
                <cw-home-icon></cw-home-icon>
                <span>Home</span>
            </button>
            <button add class="btn-accion">
                <cw-expense-icon></cw-expense-icon>
                <span>Add</span>
                <bind-element
                        from="button[add]:(click)" to="expense-form:reset">
                </bind-element>
                <bind-element
                        value="collapse"
                        from="button[add]:(click)" to="[form]:toggleClass">
                </bind-element>
            </button>

            <button class="btn-accion">
                <cw-search-icon></cw-search-icon>
                <span>Search</span>
            </button>

        </div>
    `,
    // language=CSS
    style: `
        /* Estilo de la barra de acciones */
        .barra-acciones {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: var(--content-bg);
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 10px 10px;

            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        /* Estilos de los botones de acción */
        .btn-accion {
            background-color: transparent;
            border: none;
            cursor: pointer;
            padding: 0 5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: white;
            font-size: 12px;
            gap: 4px;
        }

        .btn-accion i {
            margin-right: 5px;
        }

        cw-home-icon, cw-plus-icon, cw-search-icon, cw-expense-icon {
            height: 22px;
            width: 22px;
        }

        .hidden {
            display: none;
        }

        .card {
            padding: 0.5rem;
            outline-offset: 4px;
            outline: var(--card-outline);
            border-radius: 5px;
            background: var(--card-bg);
            color: var(--card-fc);
        }

        .card[form] {
            bottom: 80px;
            position: absolute;

            width: -webkit-fill-available;
            height: calc(100% - 80px);
            left: 0;
            transition: all 0.2s ease-out;

        }

        .collapse {
            height: 0 !important;
            padding: 0;
            overflow: hidden;
        }

    `,
})
    .build();
