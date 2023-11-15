import {Attribute, WebComponent} from "@commonweb/core";


@WebComponent({
    selector: 'test-component',
    template: '<pre>No Data</pre>'
})
export class TestComponent extends HTMLElement {

    @Attribute('data')
    public set data(data: any) {
        console.log("aca")
        if (data) {
            console.log({data})
            this.shadowRoot.querySelector("pre").innerHTML = JSON.stringify(data, null, 2);
        }
    }
}


