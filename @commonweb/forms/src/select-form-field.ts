import {Attribute, WebComponent} from "@commonweb/core";

@WebComponent({
    selector: `select-form-field`,
    //language=HTML
    template: `
        <label for="select-input"></label>
        <select name="select-input">
            
            <template for-each="{{@host:[options]}">
                <option value=""></option>
            </template>
        </select>
    `,
    style: `:host{
            display:flex;flex-direction:column;gap:10px;color: var( --font-primary, #efefef);
        }
        select {
            padding: 12px 20px;border: 1px solid #ccc;border-radius: var(--btn-radius,4px);
            background-color: var(--bg-primary,gray);
        }
    `
})
export class SelectFormField extends HTMLElement {

    @Attribute("placeholder")
    public placeholder: string = "";

    @Attribute("label")
    public label: string = "";

    @Attribute('options')
    public options = [];
}