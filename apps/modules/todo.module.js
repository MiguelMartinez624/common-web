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
        <div style="overflow: auto;height: 80vh;padding: 3px">

            <conditional-render-cases cases case="pending">
                <div case="pending">
                    <template>
                        <todo-list list local-key="demo-pending-todo-list"></todo-list>
                    </template>
                </div>
                <div case="process">
                    <template>
                        <todo-list local-key="demo-process-todo-list"></todo-list>
                    </template>
                  
                </div>
                <div case="completed">
                    <template>
                        <todo-list local-key="demo-completed-todo-list"></todo-list>
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
            <local-storage-value todo-list key="demo-pending-todo-list"></local-storage-value>
            <todo-form></todo-form>
            <bind-element value="collapse" from="todo-form:(submit)" to="[form]:toggleClass"></bind-element>
            <bind-element input-path="detail" from="todo-form:(submit)" to="[todo-list]:append"></bind-element>
            <bind-element input-path="detail" from="todo-form:(submit)" to="todo-list[list]:sync"></bind-element>

        </div>

        </div>
    `,
    // language=CSS
    style: `
        .card {
            margin: 20px 0px;
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
    // language=CSS
    style: `
        .card {
            margin: 20px 0px;
            padding: 0.5rem;
            outline-offset: 4px;
            outline: var(--card-outline);
            border-radius: 5px;
            background: var(--card-bg);
            color: var(--card-fc);

            & h3 {
                margin: 0;
            }

            & p.wrap {
                font-size: smaller;
                color: var(--card-fc);
                opacity: 0.7;
                text-overflow: ellipsis;
                text-wrap: nowrap;
                width: 100%;
                overflow: hidden;
            }


        }


        .details {
            z-index: 3;
            padding: 1rem;
            background: var(--card-bg);
            color: var(--card-fc);
            bottom: 58px;
            position: absolute;
            width: -webkit-fill-available;
            height: calc(100% - 190px);
            left: 0;
            transition: all 0.2s ease-in-out;

            & p {
                font-size: smaller;
                color: var(--card-fc);
                opacity: 0.7;
            }

            & h3 {
                display: flex;
                justify-content: space-between;
            }
            & .comment{
                outline: 1px solid lightblue;
            }
        }

        .tip {
            width: 0px;
            height: 0px;
            position: absolute;
            background: transparent;
            border: 10px solid #556282;
        }
        .tip-left {
            top: 10px;
            left: -21px;
            border-top-color: transparent;
            border-left-color: transparent;
            border-bottom-color: transparent;
        }


        .dialogbox .body {
            position: relative;
            max-width: 300px;
            height: auto;
            margin: 20px 10px;
            padding: 5px;
            background-color: #2d3a5b;
            border-radius: 3px;
            border: 2px solid #556282;
        }

        .body .message {
            min-height: 30px;
            border-radius: 3px;
            font-family: Arial;
            font-size: 14px;
            line-height: 1.5;
            color: #c2c6d0;
        }
        

        .collapse {
            height: 0;
            opacity: 0;
            overflow: hidden;
        }
    `,

    selector: "todo-list",
    // language=HTML
    template: `
        <div>
            <local-storage-value
                    property-matcher="date"
                    item-key="date"
                    pending-list
                    key="{{@host:[localKey]}}">
            </local-storage-value>
            <bind-element
                    input-path="detail"
                    from="[pending-list]:(appended-value)"
                    to="[todo-pending-list]:push">
            </bind-element>
            <template loop-key="date" for-each="[pending-list]:[value]">
                <div class="card">
                    <h3>{{@host:[data.title]}}
                        <bind-element
                                value="collapse"
                                from="@parent:(click)"
                                to="[detail]:toggleClass">
                        </bind-element>
                    </h3>
                    <p class="wrap">
                        {{@host:[data.description]}}
                    </p>
                    <div style="display: flex;
                    justify-content: end;
                    align-items: center; gap: 6px;">
                        1
                        <cw-comment-icon style="fill: white;height: 15px;width: 15px"></cw-comment-icon>
                    </div>
                </div>
                <div toggle detail class=" details collapse">
                    <h3>{{@host:[data.title]}} <span>Close  <bind-element
                            value="collapse"
                            from="@parent:(click)"
                            to="[detail]:toggleClass">
                        </bind-element></span></h3>
                    <h4>Decription</h4>
                    <p>
                        {{@host:[data.description]}}
                    </p>
                    <h4>Comments</h4>
                    <div>
                        <div class="dialogbox">
                            <div class="body">
                                <span class="tip tip-left"></span>
                                <div class="message">
                                    <span>
                                        I just made a comment about this comment box which is purely made from CSS.
                                    <br>
                                        This should be displayed on some kinf of markdown
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    `
})
    .with_attribute("local-key", function (val) {
        this.localKey = val;
    })
    .with_method("sync",function () {
        this.evaluateDirectives();
    })
    .on_init(function () {
        this.evaluateDirectives();
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
                <textarea-field rows="12" property="description" label="Description" placeholder="Comida"></textarea-field>
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
