window.RegisterWebComponent({
    selector: "home-module",
    // language=HTML
    template: `
        <div>
            <div class="card ">
                <h4 style="    margin: 0;
    border-bottom: 1px solid #9fadd0;
    padding-bottom: 0.6rem">Todos Summary</h4>
                <div class="centered flex flex-between">
                    <div class="text-center">
                        <h4>Pending</h4>
                        <p>
                            0
                        </p>
                    </div>
                    <div class="text-center">
                        <h4>Progress</h4>
                        <p>
                            0
                        </p>
                    </div>
                    <div class="text-center">
                        <h4>Completed</h4>
                        <p>
                            0
                        </p>
                    </div>
                </div>
            </div>
        </div>

    `,
    // language=CSS
    style: `
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

        .flex {
            display: flex;
        }

        .text-center {
            text-align: center;
        }

        .flex-between {
            justify-content: space-between;
        }

    `,
})
    .with_method("changeRoute", function (newRoute) {
        this.dispatchEvent(new CustomEvent("navigation-event", {detail: newRoute}))
    })
    .build();
