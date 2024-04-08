window.RegisterWebComponent({
    selector: "expenses-module",
    // language=HTML
    template: `
        <h4>Streams</h4>
        <local-storage-value
                property-matcher="id"
                item-key="id"
                data-list
                key="demo-streams">
        </local-storage-value>
        <bind-element input-path="detail"
                      from="[data-list]:(appended-value)" to="[stream-list]:push">
        </bind-element>
        <div style="overflow: auto;height: 84vh;position: relative">
            <template stream-list for-each="[data-list]:[value]">
                <stream-card data="{{@host:[data]}}"></stream-card>
            </template>

            <floating-content>
                <cw-plus-icon slot="trigger"></cw-plus-icon>
                <cw-card slot="content" form>
                    <stream-form>
                        <bind-element input-path="detail" from="@parent:(submit)"
                                      to="[data-list]:append"></bind-element>
                        <bind-element from="@parent:(submit)" to="floating-content:close"></bind-element>
                    </stream-form>
                </cw-card>
            </floating-content>
        </div>
       

    `,
    // language=CSS
    style: ``,
})

    .build();


window.RegisterWebComponent({
    // language=CSS
    style: `
        .detail-header {
            display: flex;
            align-items: center;
            border-bottom: 1px solid white;
            padding: 1rem;
            justify-content: space-between;
        }

        .small-icon {
            height: 24px;
            fill: white;

        }

        h4, h3 {
            margin: 0;
        }

        .card {
            padding: 1rem;
            outline-offset: 4px;
            outline: var(--card-outline);
            border-radius: 5px;
            background: var(--card-bg);
            color: var(--card-fc);
            margin: 1.4rem 0px;

        }


        .fixed {
            width: 100%;
            position: fixed;
            transition: all 0.2s ease-out;
            top: 0;
            height: calc(100% - 50px);
            background: var(--card-bg);
            left: 0;
            z-index: 2;
        }

        .collapse {

            left: -100%;
            overflow: hidden;
        }`,
    selector: `stream-card`,
    //language=HTML
    template: `
        <div class="card">
            <bind-element value="collapse" from="@parent:(click)" to="[toggle]:toggleClass"></bind-element>
            <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 10px">
                <h3>{{@host:[data.title]}}</h3>
                <span style="color: #02b9b9">{{@host:[data.type]}}</span>
            </div>
            <span style="font-size: xx-large">{{@host:totalAmount}}</span>
            <div style="display: flex;justify-content: end;align-items: center;gap:8px">
                <strong> {{@host:transactionsCount}}</strong>
                <cw-tansaction-icon class="small-icon"></cw-tansaction-icon>
            </div>
        </div>
        <bind-element value="{{@host:[data.id]}}"
                      from=".card:(click)"
                      to="expenses-list:setStreamID">
        </bind-element>

        <div toggle class="collapse fixed">
            <div>
                <div class="detail-header">
                    <cw-left-arrow-icon>
                        <bind-element value="collapse" from="@parent:(click)"
                                      to="[toggle]:toggleClass"></bind-element>

                    </cw-left-arrow-icon>
                    <h3>{{@host:[data.title]}}</h3>
                    <span style="color: #02b9b9">{{@host:[data.type]}}</span>
                </div>
                <div style="padding: 1rem;">
                    <expenses-list></expenses-list>
                </div>
            </div>
        </div>
    `,

})
    .with_method("totalAmount", function (param) {
        if (!this.data) {
            return 0;
        }
        const transactionsStr = localStorage.getItem(this.data.id);
        if (!transactionsStr) {
            return 0;
        }

        const transactions = JSON.parse(transactionsStr);
        const total = transactions.reduce((acc, t) => acc += t.transactions.reduce((totalDay, td) => totalDay += td.amount, 0), 0);
        return total.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    })
    .with_method("transactionsCount", function (param) {
        if (!this.data) {
            return 0;
        }
        const transactionsStr = localStorage.getItem(this.data.id);
        if (!transactionsStr) {
            return 0;
        }

        const transactions = JSON.parse(transactionsStr);
        const total = transactions.reduce((acc, t) => acc += t.transactions.length, 0);
        return total;
    })
    .build()


window.RegisterWebComponent({
    selector: "expenses-list",
    // language=HTML
    template: `
        <div>
            <h4>Transaction List</h4>
        </div>
        <local-storage-value
                property-matcher="date"
                item-key="date"
                data-list
                key="{{@host:[streamID]}}">
        </local-storage-value>
        <bind-element input-path="detail"
                      from="[data-list]:(appended-value)" to="[expenses-list]:push">
        </bind-element>
        <bind-element input-path="detail" from="[data-list]:(item-removed)"
                      to="[expenses-list]:removeItem">
        </bind-element>
        <bind-element input-path="detail"
                      from="[data-list]:(updated-value)" to="[expenses-list]:replace">
        </bind-element>
        <div style="overflow: auto;height: 84vh;padding: 3px">
            <template expenses-list loop-key="date" for-each="@[data-list]:[value]">

                <expense-list-by-date data="{{@host:[data]}}"></expense-list-by-date>
                <bind-element
                        input-path="detail"
                        from="expense-list-by-date:(delete)"
                        to="[data-list]:removeItem">
                </bind-element>
            </template>

            <floating-content>
                <cw-plus-icon slot="trigger"></cw-plus-icon>

                <cw-card slot="content" form>
                    <expense-form></expense-form>
                    <bind-element
                            input-path="detail" from="expense-form:(new-day)"
                            to="[data-list]:append"></bind-element>
                    <bind-element input-path="detail" from="expense-form:(submit)"
                                  to="[data-list]:updateValue"></bind-element>
                    <bind-element value="collapse" from="expense-form:(submit)" to="[form]:toggleClass"></bind-element>
                    <bind-element value="collapse" from="expense-form:(new-day)" to="[form]:toggleClass"></bind-element>
                </cw-card>
            </floating-content>

        </div>


    `,
    // language=CSS
    style: `
        h4 {
            margin: 0;
        }

        .card {
            padding: 0.5rem;
            outline-offset: 4px;
            outline: var(--card-outline);
            border-radius: 5px;
            background: var(--card-bg);
            color: var(--card-fc);
        }
    `,
})
    .with_method("setStreamID", function (streamID) {
        // Usar patron de cuando seteas algo, manualente evaluar los cambios
        //ventaja q podes realizar procesos previos antes de actualizar la vista
        //y esto seria un patron del framework
        this.changeAttributeAndUpdate("streamID", streamID);
        this.checkAllInterpolations();
        this.evaluateDirectives();

    })
    .on_init(function () {
    })
    .build();


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

        h5 {
            margin: 0;
        }

        .hidden {
            display: none;
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
                <div style="display: flex;justify-content: center;align-items: center">

                    <span>{{@host:dateFormatted}}</span>
                    <cw-info-icon style="height: 16px;width: 16px;position: absolute;right: 10px;"></cw-info-icon>
                    <bind-element value="hidden" from="cw-info-icon:(click)" to="[details]:toggleClass"></bind-element>
                </div>
                <div toggle details class="hidden">
                    <div style="display: flex;justify-content: space-around;font-size: 16px;margin-top: 6px">
                        <div style="color: lightgreen">
                            <h5>Incomes</h5>
                            {{@host:incomes}}
                        </div>
                        <div style="color: rgb(198 75 19)">
                            <h5>Outcomes</h5>
                            {{@host:outcomes}}
                        </div>
                    </div>
                </div>
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
    .with_method("dateFormatted", function () {
        if (this.data) {
            const date = new Date(this.data.date);
            const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
            return utcDate.toLocaleDateString('en-EN', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            })
        }

        return ""
    })
    .with_method("incomes", function () {
        if (!this.data || !this.data.transactions) {
            return 0.00
        }
        return this.data.transactions
            .filter(t => t.amount > 0)
            .reduce((accumulator, currentValue) => {
                return accumulator + currentValue.amount;
            }, 0).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    })
    .with_method("outcomes", function () {
        if (!this.data || !this.data.transactions) {
            return 0.00
        }

        return this.data.transactions
            .filter(t => t.amount < 0)
            .reduce((accumulator, currentValue) => {
                return accumulator + currentValue.amount;
            }, 0).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    })
    .with_method("removeItem", function (params) {

        const storage = this.shadowRoot.querySelector("local-storage-value");
        const value = storage.value;
        const date = new Date(this.data.date).toString();

        const dateList = value.find(v => {
            const [days, month, year] = v.date.split("/")
            const date1 = new Date(`${year}/${month}/${days}`).toString();
            return date1 === date
        });

        if (dateList) {
            const index = dateList.transactions.findIndex(i => i.title === params);
            dateList.transactions.splice(index, 1);
            storage.setValue(value);

            // Best way??
            this.changeAttributeAndUpdate("data", dateList);
            this.checkAllInterpolations();
            // iten that need to be removed from the list
            if (dateList.transactions.length === 0) {
                this.dispatchEvent(new CustomEvent("delete", {detail: date}));
            }
        } else {
            // iten that need to be removed from the list

            this.dispatchEvent(new CustomEvent("delete", {detail: date}));

        }


    })
    .build()


window.RegisterWebComponent({
    selector: "expense-card",
    //language=CSS
    style: `
        :host {
            display: block;
            margin: 15px 0px;
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
                    {{@host:category}}

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
                        <div class="title"><span>{{@host:amountFormatted}}</span></div>
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
    .with_method("category", function () {
        if (!this.data) {
            return ""
        }
        const cariCon = this.shadowRoot.querySelector(".card-icon")

        switch (this.data.category) {
            case "car":
                cariCon.innerHTML = '<cw-car-icon></cw-car-icon>'
                break
            case "entertainment":
                cariCon.innerHTML = '<cw-gamepad-icon></cw-gamepad-icon>'
                break
            case "food":
                cariCon.innerHTML = '<cw-shopping-car-icon></cw-shopping-car-icon>'
                break
            default:
                cariCon.innerHTML = '<cw-shopping-car-icon></cw-shopping-car-icon>'

        }


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
    .with_method("amountFormatted", function () {
        if (this.data) {
            return this.data.amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
        }
        return "$00.00";
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
                <div style="padding: 1rem">
                    <h3>Category</h3>
                    <div style="display: flex;gap: 15px;">
                        <button toggle food icon>
                            <cw-shopping-car-icon></cw-shopping-car-icon>
                            <bind-element value="selected" from="button[food]:(click)"
                                          to="button[food]:toggleUniqueClass"></bind-element>
                            <bind-element value="food" from="button[food]:(click)"
                                          to="expense-form:setCategory"></bind-element>

                        </button>
                        <button toggle entertainment icon>
                            <cw-gamepad-icon></cw-gamepad-icon>
                            <bind-element value="selected" from="button[entertainment]:(click)"
                                          to="button[entertainment]:toggleUniqueClass"></bind-element>
                            <bind-element value="entertainment" from="button[entertainment]:(click)"
                                          to="expense-form:setCategory"></bind-element>
                        </button>
                        <button toggle car icon>
                            <cw-car-icon></cw-car-icon>
                            <bind-element value="selected" from="button[car]:(click)"
                                          to="button[car]:toggleUniqueClass"></bind-element>
                            <bind-element value="car" from="button[car]:(click)"
                                          to="expense-form:setCategory"></bind-element>
                        </button>
                    </div>

                </div>
                <form-field property="title" label="Reason" placeholder="Comida"></form-field>
                <form-field property="description" label="Description" placeholder="Comida"></form-field>
                <form-field format="currency" property="amount" label="Amount" placeholder="amount"></form-field>
                <form-field format="date" property="date" label="Date" placeholder="dd/mm/yyyy"></form-field>
                <button submit>Create</button>

            </form-group>
            <bind-element input-path="detail.data" from="form-group:(submit)" to="@host:submit"></bind-element>
            <bind-element from="button[submit]:(click)" to="form-group:submit"></bind-element>
        </div>

    `
})
    .with_method("setCategory", function (va) {
        this.category = va;
    })
    .with_method("dateFormatted", function () {
        if (this.data) {
            return new Date(this.data.date).toLocaleDateString();
        }
        return "00/00/0000"
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
        this.category = null;
        this.shadowRoot.querySelector("form-group").reset();
    })
    .build()


window.RegisterWebComponent({
    selector: "stream-form",
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
                <form-field property="title" label="Reason" placeholder="Cash"></form-field>
                <select-form-field property="type">
                    <option disabled selected>Select a stream Type</option>
                    <option value="Fixed">Fixed</option>
                    <option value="Debt">Debt</option>
                    <option value="Pending">Pending</option>
                </select-form-field>
                <form-field format="currency" property="amount" label="Initial Amount"
                            placeholder="$323.23"></form-field>
                <button submit>Create</button>

            </form-group>
            <bind-element input-path="detail.data" from="form-group:(submit)" to="@host:submit"></bind-element>
            <bind-element from="button[submit]:(click)" to="form-group:submit"></bind-element>
        </div>

    `
})
    .with_method("submit", function (data) {
        function generateUUID() {
            // Generar un array de 16 bytes aleatorios
            const bytes = new Uint8Array(16);
            window.crypto.getRandomValues(bytes);

            // Convertir los bytes a una cadena hexadecimal
            let uuid = "";
            for (const byte of bytes) {
                uuid += byte.toString(16).padStart(2, "0");
            }

            // Insertar los guiones en la posición correcta
            return uuid.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
        }

        data.initialDate = new Date();
        data.id = generateUUID();
        this.reset()
        this.dispatchEvent(new CustomEvent("submit", {detail: data}));

    })
    .with_method("reset", function (data) {
        this.shadowRoot.querySelector("form-group").reset();
    })
    .on_init(function () {

    })

    .build()
