import {WebComponent} from "@commonweb/core";
import {ExpensesContext} from "./expenses-context";
import {TransactionCategory} from "./models";


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


@WebComponent({
    selector: "expense-form",
    //language=CSS
    style: `
        :host {
            display: block;
            margin: 30px 0px;
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
export class ExpenseFormComponent extends HTMLElement {
    private category: TransactionCategory;

    setCategory(va: TransactionCategory) {
        this.category = va;
    }


    submit(data) {
        data.id = generateUUID();


        (this as any)
            .query()
            .where("expenses-context")
            .then((result: ExpensesContext) => {
                this.dispatchEvent(new CustomEvent("submit", {detail: data}));
                this.reset();
            })
            .catch(console.error)
            .build()
            .execute();

        delete data.amount;


    }

    reset() {
        this.category = null;
        (this.shadowRoot.querySelector("form-group") as unknown as any).reset();
    }
}
