window.RegisterWebComponent({
    selector: "expense-list-by-date",
    //language=CSS
    style: `
        .date-title {
            text-align: center;
            background: #25304d;
            outline: 1px solid #232437;
            padding: 6px;
            border-radius: 7px;
        }

        :host {
            display: block;
            margin: 30px 0px;
            position: relative;
        }
    `,
    //language=HTML
    template: `
        <local-storage-value
                item-key="data"
                data-list
                key="demo-expenses-list">
        </local-storage-value>
        <div>
            <div class="date-title">
                <div><span>{{@host:[data.date]}}</span></div>

            </div>
            <template transactions-list loop-key="title" for-each="@host:[data.transactions]">
                <expense-card data="{{@host:[data]}}"></expense-card>

                <bind-element
                        input-path="detail"
                        from="expense-card:(delete)"
                        to="expense-list-by-date:removeItem">
                </bind-element>
                <bind-element
                        input-path="detail"
                        from="expense-card:(delete)"
                        to="[transactions-list]:removeItem">
                </bind-element>
            </template>
        </div>
    `
})
    .with_method("removeItem", function (params) {
        debugger
        console.log(params)
        const storage = this.shadowRoot.querySelector("local-storage-value");
        const value = storage.value;
        const date = new Date(this.data.date);

        const dateList = value.find(v => {
            const date1 = new Date(v.date).toLocaleDateString();
            return date1 === date.toLocaleDateString()
        });

        if (dateList) {
            const index = dateList.transactions.findIndex(i => i.title === params);
            dateList.transactions.splice(index, 1);
        }

        storage.setValue(value);
        // iten that need to be removed from the list
        if (dateList.transactions.length === 0) {
            this.dispatchEvent(new CustomEvent("delete", {detail: date.toLocaleDateString()}));
        }
    })
    .build()


window.RegisterWebComponent({
    selector: "expense-card",
    //language=CSS
    style: `
        :host {
            display: block;
            margin: 30px 0px;
            position: relative;
        }

        .card {
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
            height: 2rem;
            width: 2rem;
            border-radius: 50%;
            padding: 1rem;
        }

        .flex-centered {
            justify-content: center;
            align-items: center;
        }

        .title {
            font-weight: bold;
        }

        .text-end {
            text-align: end;

        }

        .sub-title {
            opacity: 0.7;
            font-size: 14px;
        }

        ul {
            list-style: none;
            padding: 0;
            width: 60vw;
            margin: 0;
        }

        .hidden {
            display: none
        }

        [options] {
            z-index: 4;
            position: absolute;
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
            right: 0px;
            top: 54px;
        }

        li {
            font-weight: bold;
        }

        .line {
            height: 1px;
            width: 100%;
            background: white;
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
            <div style="flex: 1;justify-content: space-between;" class="flex ">
                <div>
                    <!--Content-->
                    <div class="title"><span>{{@host:[data.title]}}</span></div>
                    <div class="sub-title"><span>{{@host:[data.description]}}</span></div>
                </div>
                <div class="flex gap flex-centered">
                    <div class="text-end">
                        <div class="title"><span>{{@host:[data.amount]}}</span></div>
                        <!--                        <div class="sub-title"><span>{{@host:dateFormatted}}</span></div>-->
                    </div>
                    <div style="padding: 10px">
                        <cw-menu-dots-icon menu style="width:20px;height: 20px; "></cw-menu-dots-icon>
                        <bind-element value="hidden" from="[menu]:(click)" to="[options]:toggleClass"></bind-element>
                    </div>
                </div>
            </div>
            <div options toggle class=" hidden">
                <!--Actions-->
                <ul>
                    <li style="background:rgb(60 130 246); padding:1rem">
                        Edit Item
                    </li>
                    <div class="line"></div>
                    <li style="background:rgb(234,52,52); padding:1rem" delete>
                        Delete Item
                        <bind-element from="[delete]:(click)" to="@host:delete"></bind-element>
                        <bind-element value="hidden" from="[delete]:(click)" to="[options]:toggleClass"></bind-element>
                    </li>

                </ul>

            </div>

        </div>
        <!--        </template>-->
    `
})
    .with_method("delete", function (params) {
        this.dispatchEvent(new CustomEvent("delete", {detail: this.data.title}))
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

        button {
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
                <form-field property="title" label="Reason" placeholder="Comida"></form-field>
                <form-field property="description" label="Description" placeholder="Comida"></form-field>
                <form-field property="amount" label="Amount" placeholder="amount"></form-field>
                <form-field format="date" property="date" label="Date" placeholder="dd/mm/yyyy"></form-field>
                <button>Create</button>

            </form-group>
            <bind-element input-path="detail.data" from="form-group:(submit)" to="@host:submit"></bind-element>
            <bind-element from="button:(click)" to="form-group:submit"></bind-element>
        </div>

    `
})
    .with_method("dateFormatted", function () {
        if (this.data) {
            return new Date(this.data.date).toLocaleDateString();
        }
        return "00/00/0000"
    })
    .with_method("submit", function (data) {
        const storage = this.shadowRoot.querySelector("local-storage-value");
        const value = storage.value;
        if (!value || value.length === 0) {
            // Initialize
            this.dispatchEvent(new CustomEvent("new-day", {
                detail:
                    {
                        date: new Date(data.date).toLocaleDateString(),
                        transactions: [data]
                    }

            }));
            return
        }

        const dateList = value.find(v => {
            const date1 = new Date(v.date).toLocaleDateString();
            const date2 = new Date(data.date).toLocaleDateString();
            return date1 === date2
        });

        if (dateList) {
            dateList.transactions.push(data);
        } else {
            this.dispatchEvent(new CustomEvent("new-day", {
                detail:
                    {
                        date: new Date(data.date).toLocaleDateString(),
                        transactions: [data]
                    }

            }));
            return
        }

        // storage.setValue(value);

        this.dispatchEvent(new CustomEvent("submit", {detail: dateList}))
    })
    .build()
