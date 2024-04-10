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
                        <local-storage-value
                                property-matcher="date"
                                item-key="date"
                                pending-list
                                key="demo-pending-todo-list">
                        </local-storage-value>
                        <p>
                            {{[pending-list]:[value.length]}}
                        </p>
                    </div>
                    <div class="text-center">
                        <h4>Progress</h4>
                        <local-storage-value
                                property-matcher="date"
                                item-key="date"
                                progress-list
                                key="demo-progress-todo-list">
                        </local-storage-value>
                        <p>
                            {{[progress-list]:[value.length]}}
                        </p>
                    </div>
                    <div class="text-center">
                        <local-storage-value
                                property-matcher="date"
                                item-key="date"
                                completed-list
                                key="demo-completed-todo-list">
                        </local-storage-value>
                        <h4>Completed</h4>
                        <p>
                            {{[completed-list]:[value.length]}}
                        </p>
                    </div>
                </div>
            </div>

            <div class="card" style="height: 330px;    margin-top: 14px;">
                <h4 style="    margin: 0;
    border-bottom: 1px solid #9fadd0;
    padding-bottom: 0.6rem">Annaucements</h4>

                <amp-ad width="100vw" height="320"
                        type="adsense"
                        data-ad-client="ca-pub-6199438250356984"
                        data-ad-slot="7202022301"
                        data-auto-format="rspv"
                        data-full-width="">
                    <div overflow=""></div>
                </amp-ad>
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
