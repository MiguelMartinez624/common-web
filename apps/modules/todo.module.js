window.RegisterWebComponent({
    selector: "todos-module",
    // language=HTML
    template: `
        <div>
            <h4 class="no-margin">Todo List</h4>
        </div>
        
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
        <div style="display: flex;">
            <div pending toggle class=" tab">
                <h4>Pending</h4>
                <div toggle class="linea visible">
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
        <div style="overflow: auto;height: 80vh;padding: 3px">

            <conditional-render-cases case="pending">
                <div case="pending">
                    <template>
                        <local-storage-value
                                property-matcher="date"
                                item-key="date"
                                pending-list
                                key="demo-pending-todo-list">
                        </local-storage-value>
                        <bind-element
                                input-path="detail"
                                from="[data-list]:(appended-value)"
                                to="[todo-pending-list]:push">
                        </bind-element>
                        <template todo-pending-list loop-key="date" for-each="@[pending-list]:[value]">
                            <div class="card">
                                <h3>{{@host:[data.title]}}</h3>
                                <p>
                                    {{@host:[data.description]}}
                                </p>
                            </div>
                        </template>


                    </template>
                </div>
            </conditional-render-cases>

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
            <bind-element value="collapse" from="todo-form:(submit)" to="[form]:toggleClass"></bind-element>
            <bind-element
                    input-path="detail"
                    from="todo-form:(submit)"
                    to="[pending-list]:append"></bind-element>
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
        this.dispatchEvent(new CustomEvent("submit", {detail: data}));

    })
    .with_method("reset", function (data) {
        this.shadowRoot.querySelector("form-group").reset();
    })
    .build()
