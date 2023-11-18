import {Attribute, WebComponent, extractData} from "@commonweb/core";

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export type FieldType = "string" | "date" | "currency" | "image"

export class FieldDescription {
    label: string;
    propertyName: string;
    type: FieldType;
}

function getFieldTemplate(type: FieldType, value: any): string {
    switch (type) {
        case "string":
            return value;
        case "date":
            return new Date(value).toLocaleDateString();
        case "currency":
           return formatter.format(Number(value));
        case "image":
            return `<img height="80" width="80"  alt="no" src="${value} "/>`

    }
}

@WebComponent({
    template: `<table>
                <thead></thead>
                <tbody></tbody>
 </table>`,
    selector: 'go-table',
    style: `
    :host{    
        width: 100%;
        display: flex;
       }
       table{width:100%}
        table, th, td {
            border: 1px solid var(--border-line-color, rgba(28, 28, 28, 0.10));
            border-collapse: collapse;
        }
        tr:hover {
            cursor:pointer;
            background-color:var(--bg-primary)
        }
        th,td {
            padding:0.6rem;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        
        td:has(img){
            padding: 0.1rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `

})
export class Table extends HTMLElement {
    private configurations: FieldDescription[] = [];
    private _data: any[] = [];

    static get observedAttributes() {
        return ['configurations']
    }

    @Attribute('configurations')
    public updateConfigurations(configurations: FieldDescription[]) {
        this.configurations = configurations;
        const headers = configurations.map(c => c.label);
        const table = this.shadowRoot.querySelector("thead");
        table.innerHTML = '';
        const rowHeaders = document.createElement('tr');
        for (const header of headers) {
            const headerElement = document.createElement("th");
            headerElement.innerHTML = header;
            rowHeaders.appendChild(headerElement);
        }

        table.appendChild(rowHeaders);
        if (this._data.length > 0) {
            this.generateDataRows(this._data);
        }
    }

    public set data(data: any[]) {
        this._data = data;
        this.generateDataRows(data);


    }

    private generateDataRows(data: any[]) {
        if (!this.configurations || this.configurations.length === 0) {
            // configuration no ready yet
            return;
        }
        const table = this.shadowRoot.querySelector("tbody");
        table.innerHTML = '';
        data.forEach((item) => {
            const row = document.createElement('tr');

            this.configurations.forEach((field) => {
                const headerElement = document.createElement("td");
                const value = extractData(field.propertyName, item);
                headerElement.innerHTML =  `${getFieldTemplate(field.type, value)}`
                row.appendChild(headerElement);
            });

            row.addEventListener("click", () => {
                const ev = new CustomEvent("row-clicked", {detail: {data: item}});
                this.dispatchEvent(ev);
            });

            table.appendChild(row);
        });
    }
}