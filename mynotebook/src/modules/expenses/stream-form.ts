import {WebComponent} from "@commonweb/core";
import {ExpensesContext} from "./expenses-context";
import {NewStreamRequest, Stream} from "./models";
import {CARD_STYLE} from "./styles";

function obtenerFechaCalendario(fechaActual) {
    // Obtener la fecha actual

    // Formatear la fecha
    const fechaCalendario = `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;

    // Devolver la fecha formateada
    return fechaCalendario;
}




@WebComponent({
    selector: "stream-form",
    //language=CSS
    style: `
        :host {
            display: block;
            margin: 30px 0px;
        }

        ${CARD_STYLE}
        .flex {
            display: flex;
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
export class StreamForm extends HTMLElement {
    submit(data) {
        data.initialDate = obtenerFechaCalendario(new Date());


        (this as any)
            .query()
            .where("expenses-context")
            .then((result: ExpensesContext) => {
                result.addNewStream(new NewStreamRequest(
                    data.title,
                    data.initialDate,
                    data.type,
                    data.amount
                ));

                this.dispatchEvent(new CustomEvent("submit"));
                this.reset();
            })
            .catch(console.error)
            .build()
            .execute();

        delete data.amount;


    }

    reset() {
        (this.shadowRoot.querySelector("form-group") as unknown as any).reset();
    }
}
