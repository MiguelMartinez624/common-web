if (window.RegisterWebComponent) {
    window.RegisterWebComponent({
        selector: 'navigation-bar',
        // language=HTML
        template: `
            <div class="barra-acciones">
                <button toggle home class="btn-accion">
                    <cw-home-icon></cw-home-icon>
                    <span>Home</span>
                    <bind-element
                            value="home"
                            from="@parent:(click)" to="navigation-bar:changeRoute">
                    </bind-element>
                    <bind-element
                            value="selected"
                            from="@parent:(click)" to="[home]:toggleUniqueClass">
                    </bind-element>
                </button>
                <button toggle expenses class="selected btn-accion">
                    <div style="height: 19px;">
                        <cw-expense-icon style="height: 15px;width: 15px"></cw-expense-icon>
                    </div>
                    <span>Expenses</span>
                    <bind-element
                            value="expenses"
                            from="@parent:(click)" to="navigation-bar:changeRoute">
                    </bind-element>
                    <bind-element
                            value="selected"
                            from="@parent:(click)" to="[expenses]:toggleUniqueClass">
                    </bind-element>
                </button>
                <button toggle todo class="btn-accion">
                    <cw-todo-icon></cw-todo-icon>
                    <span>To-Do</span>
                    <bind-element
                            value="todos"
                            from="@parent:(click)" to="navigation-bar:changeRoute">
                    </bind-element>
                    <bind-element
                            value="selected"
                            from="@parent:(click)" to="[todo]:toggleUniqueClass">
                    </bind-element>
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
                width: calc(100% - 20px);
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
                height: 35px;
            }

            cw-home-icon, cw-todo-icon {
                fill: white;
                height: 19px;
                width: 19px;
            }

            cw-expense-icon {
                fill: white;
            }

            .selected {
                color: #80d674;
                fill: #80d674;

                & * {
                    color: #80d674;
                    fill: #80d674;
                }
            }

        `,
    })
        .with_method("changeRoute", function (newRoute) {
            this.dispatchEvent(new CustomEvent("navigation-event", {detail: newRoute}))
        })
        .build();
}