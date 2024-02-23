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

const DEFAULT_QUERY = {
    "query": {
        "name": "",
        "zones": []
    },
    "page": {
        "page": 1,
        "size": 100
    }
};

@WebComponent({
    selector: 'backoffice-entity-page',
    style: `:host{display:block;height:100%}`,
    template: `
        <h3 title style="text-transform: capitalize">Lista</h3>
        <div>
            <tt-button>Crear</tt-button>
            <bind-element  from="tt-button:(click)" to="side-panel:toggle"></bind-element>
            <go-card>
                <data-fetcher data></data-fetcher>

                <data-fetcher configuration=""></data-fetcher>
                <bind-element input-path="detail.data.content" from="data-fetcher[data]:(request-success)" to="go-table:generateDataRows"></bind-element>
                <bind-element value="table" from="data-fetcher[data]:(request-success)"  to="conditional-render-cases:[state]"></bind-element>
                <bind-element value="loading" from="data-fetcher[data]:(loading)"  to="conditional-render-cases:[state]"></bind-element>
                <bind-element value="error" from="data-fetcher[data]:(request-failed)"  to="conditional-render-cases:[state]"></bind-element>

               <conditional-render-cases style="height: 95%;width: 100%:overflow-y:auto; " state="loading">
                  <div case="table"><go-table ></go-table></div>
                    <div style="height: 100%;width: 100%" case="loading">
                        <div  style="display: flex;align-items: center;justify-content: center;height: 300px;flex-direction: column">
                            <brand-icon-animated-component></brand-icon-animated-component>
                            Cargando...
                        </div>
                    </div>
                    <div style="height: 100%;width: 100%" case="error">
                        <div  style="display: flex;align-items: center;justify-content: center;height: 300px;flex-direction: column">
                            Lo sentimos! al parecer el imperio esta hackiando nuestros servidores!
                        </div>
                    </div>
               </conditional-render-cases>
               
            </go-card>
        </div>
        <side-panel>
            <bind-element  from="backoffice-entity-form:(close)" to="side-panel:toggle"></bind-element>
            <bind-element value="${JSON.stringify(DEFAULT_QUERY)}" from="backoffice-entity-form:(close)" to="data-fetcher[data]:execute"></bind-element>

            <backoffice-entity-form></backoffice-entity-form>
        </side-panel>
        
        `
})
export class BackofficeEntityPage extends HTMLElement {
    connectedCallback() {
        setTimeout(() => {
            this.fetchData(window.location.href.split("/").pop());
        }, 300)
    }

    private fetchData(entity: string) {
        this.shadowRoot.querySelector("h3[title]").innerHTML = `Lista de ${entity}`
        const configDataFetcher = this.shadowRoot.querySelector("data-fetcher[configuration]");
        const queryDataFetcher = this.shadowRoot.querySelector("data-fetcher[data]");
        configDataFetcher.setAttribute("configurations", JSON.stringify(listConfiguration(entity)));
        const listingConfiguration = window[`endpoint::listing-${entity}`];
        if (listingConfiguration.method === 'POST') {
            queryDataFetcher.setAttribute("payload", JSON.stringify(DEFAULT_QUERY));
            queryDataFetcher.setAttribute("configurations", JSON.stringify(listingConfiguration));
        } else {
            queryDataFetcher.setAttribute("configurations", JSON.stringify(listingConfiguration));

        }
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
            </div>

       <bind-element from="data-fetcher[submit]:(request-success)" to="snackbar-component:toggle"></bind-element>
        <snackbar-component>
            Operación exitosa
        </snackbar-component>
`
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
        this.submitDataFetcher.setAttribute("configurations", JSON.stringify(fetchConfiguration));

        if (!entity) {
            this.form.reset();
            return;
        }


        this.form.setValue(entity);

    }

    connectedCallback() {
        this.submitDataFetcher = this.shadowRoot.querySelector("data-fetcher[submit]") as DataFetcher;
        this.submitDataFetcher.addEventListener("request-success", () => {
            const closeEvent = new CustomEvent("close", {detail: {data: null}});
            this.dispatchEvent(closeEvent)
        })
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
        // TODO crear elemento custom event q se emeta dentro de element bind y significque q pueda despacharlo
        // quizas la data tmb se pueda mover asi?
        const closeEvent = new CustomEvent("close", {detail: {data: null}});
        this.dispatchEvent(closeEvent)
    }
}
