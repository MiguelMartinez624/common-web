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
        @import "common.css";
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
    .with_method("changeRoute", function (newRoute) {
        this.dispatchEvent(new CustomEvent("navigation-event", {detail: newRoute}))
    })
    .build();
