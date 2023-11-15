import {Attribute, WebComponent} from "@commonweb/core";

@WebComponent({
    selector: 'go-grid',
    template: `<div class="grid"></div>`,
    style: `
    .grid{
         width:100%;
         margin: auto;
          gap: 15px;
         display: grid;
         grid-template-columns: auto;
    }
    
        @media (min-width: 768px){
           .grid {
                  width:70%;
                  margin: auto;
                  gap: 15px;
                  column-gap: 15px;
                  display: grid;
                  grid-template-columns: auto auto auto;
               
           }
    }`
})
export class GridIterator extends HTMLElement {
    // still required
    static get observedAttributes() {
        return ["data", "grid-count"];
    }

    @Attribute('grid-count')
    public updateGridCount(gridCount: string): void {
        let autoStr = ""
        for (let i = 0; i < Number(gridCount); i++) {
            autoStr += "auto "
        }
        (this.shadowRoot.querySelector(".grid") as HTMLElement)
            .style.gridTemplateColumns = autoStr;
    }

    public updateData(data: any[]) {
        this.shadowRoot.querySelector(".grid").innerHTML = '';
        // restart grid
        if (!data || !Array.isArray(data)) {
            console.warn(`no data on ${{data}}`);
            return;
        }


        data.forEach(this.appendItem.bind(this));
    }

    @Attribute("data")
    public set data(data: any[]) {
        this.shadowRoot.querySelector(".grid").innerHTML = '';
        // restart grid
        if (!data ||!Array.isArray(data)) {
            console.warn(`no data on ${{data}}`);
            return;
        }


        data.forEach(this.appendItem.bind(this));
    }

    public appendItem(product: any) {
        const productElement: any = (document.createElement(this.ElementName) as unknown as any);
        productElement.setAttribute("data", JSON.stringify(product));

        // events to bubble up
        this.proxyChildEvents(productElement);


        this.shadowRoot.querySelector(".grid").appendChild(productElement);
    }

    private proxyChildEvents(productElement: any) {
        const events = productElement.EventsToBubble;
        if (events) {
            events.forEach((eventKey: string) => {
                productElement.addEventListener(eventKey, (data) => {
                    this.dispatchEvent(new CustomEvent(data.type, {
                        bubbles: true,
                        detail: data.detail,

                    }));
                })
            });
        }
    }

    public get ElementName(): string {
        return this.getAttribute("element-name");
    }
}