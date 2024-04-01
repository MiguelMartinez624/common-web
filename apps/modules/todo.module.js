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


            <div style="overflow: auto;height: 84vh;padding: 3px">
          
                <button add class="floating-action">
                    <div>
                        <cw-plus-icon></cw-plus-icon>
                    </div>
                    <bind-element
                            from="button[add]:(click)" to="todo-form:reset">
                    </bind-element>
                    <bind-element
                            value="collapse"
                            from="button[add]:(click)" to="[form]:toggleClass">
                    </bind-element>
                </button>
            </div>
            <div form toggle class="card collapse">
                <todo-form></todo-form>
                
            </div>

        </div>
    `,
    // language=CSS
    style: `
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
        
        .floating-action {
            background: none;
            border: none;
            position: fixed;
            z-index: 2;
            bottom: 70px;
            right: 20px;
        }

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


window.RegisterWebComponent({
    selector: "todo-form",
    //language=CSS
    style: `
        :host {
            display: block;
            margin: 30px 0px;
        }

        .card {
            padding: 0.5rem;
            outline-offset: 4px;
            outline: var(--card-outline);
            border-radius: 5px;
            background: var(--card-bg);
            color: var(--card-fc);
        }

        .flex {
            display: flex;
        }

        .card-icon {
            height: 5rem;
            width: 5rem;
            border-radius: 50%;
            background: var(--content-bg);
            padding: 1rem;
        }

        .flex-centered {
            justify-content: center;
            align-items: center;
        }

        button[submit] {
            border: none;
            outline: 2px solid #a083c3;
            background: #5339d6;
            font-weight: bold;
            padding: 1rem;
            font-size: large;
            width: -webkit-fill-available;
            color: white;
            margin: 10px;
        }

        button[icon] {
            background: none;
            align-items: center;
            text-align: center;
            display: flex;
            justify-content: center;
            width: fit-content;
            padding: 1rem;
            outline: none;
            border: none;
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        }

        [icon].selected {
            border-radius: 5px;
            outline: 2px solid #9a77e0;
        }

        .gap {
            gap: 1.5rem;
        }`,
    //language=HTML
    template: `
        <div>
            <local-storage-value
                    item-key="date"
                    data-list
                    key="demo-expenses-list">
            </local-storage-value>


            <!--Stepped Form-->
            <form-group>
                <form-field property="title" label="Title" placeholder="Comida"></form-field>
                <form-field property="description" label="Description" placeholder="Comida"></form-field>
                <form-field format="date" property="date" label="Date" placeholder="dd/mm/yyyy"></form-field>
                <button submit>Create</button>

            </form-group>
            <bind-element input-path="detail.data" from="form-group:(submit)" to="@host:submit"></bind-element>
            <bind-element from="button[submit]:(click)" to="form-group:submit"></bind-element>
        </div>

    `
})
    .with_method("submit", function (data) {
        data.category = this.category;

        const storage = this.shadowRoot.querySelector("local-storage-value");
        const value = storage.value;
        if (!value || value.length === 0) {
            // Initialize
            this.dispatchEvent(new CustomEvent("new-day", {
                detail:
                    {
                        date: new Date(data.date).toString(),
                        transactions: [data]
                    }

            }));
            return
        }

        const dateList = value.find(v => {
            const [days, month, year] = v.date.split("/")
            const date1 = new Date(`${year}/${month}/${days}`).toString();
            const date2 = new Date(data.date).toString();
            return date1 === date2
        });

        if (dateList) {
            dateList.transactions.push(data);
        } else {
            this.dispatchEvent(new CustomEvent("new-day", {
                detail:
                    {
                        date: new Date(data.date).toString(),
                        transactions: [data]
                    }
            }));
            return
        }

        this.dispatchEvent(new CustomEvent("submit", {detail: dateList}))

    })
    .with_method("reset", function (data) {
        this.shadowRoot.querySelector("form-group").reset();
    })
    .build()