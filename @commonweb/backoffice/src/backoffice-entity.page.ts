import {Attribute, EventBind, WebComponent} from "@commonweb/core";
import {DataFetcher, DataFetcherConfiguration} from "@commonweb/data";
import {SidePanel} from "./side-panel";
import {EntityForm} from "@commonweb/forms";
// TODO make fetcher configuration complete
const listConfiguration: (entity: string) => DataFetcherConfiguration = (entity: string) => {
    return {
        injectTo: ['go-table:configurations'],
        source: `localstorage://ui/${entity}/listing`,
        auto: true,
        fieldType: 'attribute',
        method: "GET"
    }
}

// TODO make fetcher configuration complete
const formConfiguration: (entity: string) => DataFetcherConfiguration = (entity: string) => {
    return {
        injectTo: ['entity-form:configurations'],
        source: `localstorage://ui/${entity}/form`,
        auto: true,
        fieldType: 'attribute',
        method: "GET"
    }
}


@WebComponent({
    selector: 'backoffice-entity-page',
    style: `:host{display:block;height:100%}`,
    template: `
        
        <tt-button>Crear</tt-button>
        <bind-element  from="tt-button:(click)" to="side-panel:toggle"></bind-element>
        
        <go-card>
            <data-fetcher  data=""></data-fetcher>
            <data-fetcher configuration=""></data-fetcher>
            <bind-element input-path="detail.data.content" from="data-fetcher[data]:(request-success)" to="go-table:generateDataRows"></bind-element>
            <go-table></go-table>
        </go-card>
        <side-panel>
             <bind-element  from="backoffice-entity-form:(close)" to="side-panel:toggle"></bind-element>
            <backoffice-entity-form></backoffice-entity-form>
           
        </side-panel>
        
        `
})
export class BackofficeEntityPage extends HTMLElement {
    connectedCallback() {
        this.fetchData(window.location.href.split("/").pop());
    }

    private fetchData(entity: string) {
        const configDataFetcher = this.shadowRoot.querySelector("data-fetcher[configuration]");
        const queryDataFetcher = this.shadowRoot.querySelector("data-fetcher[data]");
        configDataFetcher.setAttribute("configurations", JSON.stringify(listConfiguration(entity)));
        queryDataFetcher.setAttribute("configurations", JSON.stringify(window[`endpoint::listing-${entity}`]));
    }


    @EventBind("go-table:row-clicked")
    public handleRowSelected(ev: any) {
        const sidePanel = this.shadowRoot.querySelector("side-panel") as unknown as SidePanel;
        const form = this.shadowRoot.querySelector("backoffice-entity-form") as unknown as EntityForm;
        if (!form || !sidePanel) {
            throw "No puede serr";
        }

        sidePanel.toggle();
        form.setEntity(ev.detail.data);

    }

}

@WebComponent({
    selector: 'backoffice-entity-form',

    template: `
    <div style="padding: 1rem;">
                <data-fetcher form  method="POST"></data-fetcher>
                <go-card>
                <div style="width: 100%">
                    <entity-form></entity-form>
                    <div style="display: flex;justify-content: space-evenly;margin-top: 1rem;">
                        <bind-element  from="tt-button[close]:(click)" to="entity-form:reset"></bind-element>
                        <tt-button close>Cancelar</tt-button>
                        
                        <bind-element from="tt-button[submit]:(click)" to="entity-form:submit"></bind-element>
                        <bind-element input-path="detail.values" from="entity-form:(submit)" to="data-fetcher[submit]:execute"></bind-element>
                        <data-fetcher submit ></data-fetcher>
                        <tt-button submit>Crear</tt-button>
                    </div>
                  </div>
                </go-card>
            </div>`
})
export class BackofficeEntityForm extends HTMLElement {
    private _entity: any;
    // Add private variables
    private submitDataFetcher: DataFetcher;
    private form: EntityForm;
    private submitButton: HTMLElement;

    public setEntity(entity: any) {
        this._entity = entity;
        const entName = window.location.href.split("/").pop();
        this.submitButton.innerHTML = entity ? "Actualizar" : "Crear";
        const fetchConfiguration: DataFetcherConfiguration = entity ? {
            ...window[`endpoint::update-${entName}`],
            source: entity.id
        } : window[`endpoint::create-${entName}`];
        this.submitDataFetcher.setAttribute("configurations",JSON.stringify( fetchConfiguration));

        if (!entity) {
            this.form.reset();
            return;
        }


        this.form.setValue(entity);

    }

    connectedCallback() {
        this.submitDataFetcher = this.shadowRoot.querySelector("data-fetcher[submit]") as DataFetcher;
        this.form = this.shadowRoot.querySelector("entity-form") as unknown as EntityForm;
        this.submitButton = this.shadowRoot.querySelector("tt-button[submit]");
        this.fetchData(window.location.href.split("/").pop());
    }

    private fetchData(entity: string) {
        const formConfigurationFetcher = this.shadowRoot.querySelector("data-fetcher[form]");
        formConfigurationFetcher.setAttribute("configurations", JSON.stringify(formConfiguration(entity)));

        const createDataFetcher = this.shadowRoot.querySelector("data-fetcher[submit]");
        createDataFetcher.setAttribute("configurations", JSON.stringify(window[`endpoint::create-${entity}`]));


    }

    @EventBind("tt-button[close]:click")
    public bubbleClose() {
        this.setEntity(null);
        const closeEvent = new CustomEvent("close", {detail: {data: null}});
        this.dispatchEvent(closeEvent)
    }
}