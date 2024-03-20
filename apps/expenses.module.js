window.RegisterWebComponent({
    selector: "expense-card",
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

        .gap {
            gap: 1.5rem;
        }`,
    //language=HTML
    template: `
        <!--        <template for-each="">-->
        <div class="card flex gap flex-centered">
            <div style="flex: 0.3;">
                <!--icon for topic-->
                <div class="card-icon flex flex-centered">
                    <svg style="height: 30px;width: 30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                        <path fill="lightblue"
                              d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
                    </svg>
                </div>
            </div>
            <div style="flex: 1">
                <!--Content-->
                <div>Motivo : <span>{{@host:[data.title]}}</span></div>
                <div>Monto : <span>{{@host:[data.amount]}}</span></div>
                <div>Fecha : <span>{{@host:dateFormatted}}</span></div>
            </div>
            <div>
                <!--Actions-->
            </div>

        </div>
        <!--        </template>-->
    `
})
    .with_method("dateFormatted", function () {
        if (this.data) {
            return new Date(this.data.date).toLocaleDateString();
        }
        return "00/00/0000"
    })
    .build()


window.RegisterWebComponent({
    selector: "expense-form",
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

        .gap {
            gap: 1.5rem;
        }`,
    //language=HTML
    template: `
        <div>
            <!--Stepped Form-->


        </div>

    `
})
    .build()
