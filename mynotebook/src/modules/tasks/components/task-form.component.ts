import {QueryElement, QueryResult, WebComponent} from "@commonweb/core";
import {FormGroup, TextareaField} from "@commonweb/forms";
import {BUTTON_STYLE, CARD_STYLE} from "../../../ui/styles";
import {TaskItem} from "../domain";

@WebComponent({
    selector: `task-form`,
    // language=HTML
    template: `
        <div class="card">
            <!-- TODO inset user ontext to query the users ? 
                    or use a higher level to avoid coupling between
                    uesrs -> tasks make users selector?
                    or make a slot to the form to allow external inputs without 
                    coupling to component level only at feature level as a facade.
                    
                    check how to add functionality to sloted elements
                    query from slots on inner and allow form modifications with
                    like contract to sloted elements shoul implement interface
                    
                    interface FormField {
                      reset()
                      value()
                      setValue()
                    }  
                    
                    add isValid() later on the road map, when validations are implemented
                    
                    
            -->
            <form-group>
                <form-field
                        property="title"
                        placeholder="Nombre de nota"
                        label="Title">
                </form-field>
                <textarea-field property="description"
                                placeholder="un dunlanden" rows="10"
                                label="Description">
                </textarea-field>
            </form-group>

            <div style="display: flex;justify-content: end;padding: 0 11px;gap:1rem">
                <button submit class="btn">Submit
                    <bind-element
                            from="[submit]:(click)"
                            to="@host:submit"></bind-element>
                </button>
            </div>
        </div>
    `,
    //language=CSS
    style: `
        .card {
            height: 100%;
        }

        ${CARD_STYLE}
        ${BUTTON_STYLE}
    `
})
export class TaskFormComponent extends HTMLElement {

    @QueryElement("form-group")
    public formGroup: QueryResult<FormGroup>;

    public submit() {
        const form = this.formGroup.unwrap();
        const data = form.getValue();
        this.dispatchEvent(new CustomEvent("submit", {detail: data}));
        form.reset();
    }

    connectedCallback() {

    }

    setValue(note: TaskItem) {
        const form = this.formGroup.unwrap();
        form.setValue(note);
    }


    getValue() {
        const form = this.formGroup.unwrap();
        form.getValue();
    }
}
