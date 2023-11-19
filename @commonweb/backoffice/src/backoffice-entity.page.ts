import {Attribute, EventBind, WebComponent} from "@commonweb/core";
import {DataFetcherConfiguration} from "@commonweb/data";
import {SidePanel} from "./side-panel";
import {EntityForm} from "@commonweb/forms";
// TODO make fetcher configuration complete
const listConfiguration: (entity: string) => DataFetcherConfiguration = (entity: string) => {
    return {
        injectTo: ['go-table:configurations'],
        source: `${window['__UI']}/ui/${entity}/listing`,
        auto: true,
        fieldType: 'attribute'
    }
}

// TODO make fetcher configuration complete
const formConfiguration: (entity: string) => DataFetcherConfiguration = (entity: string) => {
    return {
        injectTo: ['entity-form:configurations'],
        source: `${window['__UI']}/ui/${entity}/form`,
        auto: true,
        fieldType: 'attribute'
    }
}


@WebComponent({
    selector: 'backoffice-entity-page',
    style: `:host{display:block;height:100%}`,
    template: `
        
        <tt-button>Crear</tt-button>
        <bind-element  from="tt-button:(click)" to="side-panel:toggle"></bind-element>
        
        <data-fetcher  data="" method="GET" ></data-fetcher>
        <go-card>
                <data-fetcher configuration=""  method="POST"></data-fetcher>
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


        configDataFetcher.setAttribute(
            "configurations", JSON.stringify(listConfiguration(entity)));

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


    public setEntity(entity: any) {
        let entName = window.location.href.split("/").pop()
        const submitDataFetcher = this.shadowRoot.querySelector("data-fetcher[submit]");
        const form = this.shadowRoot.querySelector("entity-form") as unknown as EntityForm;

        if (!entity) {
            form.reset();
            submitDataFetcher.setAttribute("configurations", JSON.stringify(window[`endpoint::create-${entName}`]));
            this.shadowRoot.querySelector("tt-button[submit]").innerHTML = "Crear";
            return;
        }
        const updateConfiguration: DataFetcherConfiguration = {...window[`endpoint::update-${entName}`]};
        updateConfiguration.source += entity.id;
        submitDataFetcher.setAttribute("configurations", JSON.stringify(updateConfiguration));
        this.shadowRoot.querySelector("tt-button[submit]").innerHTML = "Actualizar";
        this._entity = entity;
        form.setValue(entity);
    }

    connectedCallback() {
        this.fetchData(window.location.href.split("/").pop());
    }

    private fetchData(entity: string) {
        const formConfigurationFetcher = this.shadowRoot.querySelector("data-fetcher[form]");
        formConfigurationFetcher.setAttribute("configurations", JSON.stringify(formConfiguration(entity)));

        const createDataFetcher = this.shadowRoot.querySelector("data-fetcher[create]");
        createDataFetcher.setAttribute("configurations", JSON.stringify(window[`endpoint::create-${entity}`]));


    }

    @EventBind("tt-button[close]:click")
    public bubbleClose() {
        this.setEntity(null);
        const closeEvent = new CustomEvent("close", {detail: {data: null}});
        this.dispatchEvent(closeEvent)
    }
}