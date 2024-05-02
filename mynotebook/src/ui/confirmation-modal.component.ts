import {Attribute, WebComponent} from "@commonweb/core";
import {BUTTON_STYLE, CARD_STYLE} from "./styles";


@WebComponent({
    selector: 'confirmation-modal',
    //language=HTML
    template: `
        <div toggle class="back blur hidden"></div>
        <div toggle class="dialog hidden">
            <div class="card">
                <h3>{{@host:[message]}}</h5>
                    <div style="display: flex;align-items: center;justify-content: space-around;gap: 1rem">
                        <button>
                            <bind-element from="@parent:(click)" to="@host:cancel"></bind-element>
                            {{@host:[cancelText]}}
                        </button>
                        <button>
                            <bind-element from="@parent:(click)" to="@host:confirm"></bind-element>
                            {{@host:[confirmText]}}
                        </button>

                    </div>
            </div>
        </div>
    `,
    //language=CSS
    style: `
        .hidden {
            display: none !important;
        }

        .back {
            background: none;
            border: none;
            display: flex;
            left: 0;
            top: 0;
            position: fixed;
            z-index: 19;
            height: 100%;
            width: 100%;
        }

        .dialog {
            background: none;
            border: none;
            display: flex;
            left: 0;
            top: 0;
            position: fixed;
            z-index: 20;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 100%;
        }

        .blur {
            backdrop-filter: blur(2px);
        }

        ${CARD_STYLE}
        ${BUTTON_STYLE}
        .card {
            padding: 1rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

        &
        * {
            text-align: center;
        }

        }

        button {
            min-width: 100px;
            text-align: center;
        }
    `
})
export class ConfirmationModalComponent extends HTMLElement {

    @Attribute("message")
    public message: string = "Are you sure?";

    @Attribute("cancel-text")
    public cancelText: string = "No";

    @Attribute("confirm-text")
    public confirmText: string = "Yes";

    public cancel(): void {
        this.close();
        this.dispatchEvent(new CustomEvent("cancel"))

    }


    public confirm(): void {
        this.close();
        this.dispatchEvent(new CustomEvent("confirm"))
    }

    public toggle(): void {
        const element = (this as any);

        element
            .query()
            .where(".dialog")
            .then((dialog: any) => {
                this.showDialog();
                this.showBack();
            })
            .catch(console.error)
            .build()
            .execute();
    }

    private showBack() {
        const element = (this as any);

        element
            .query()
            .where(".back")
            .then((dialog: any) => {
                dialog.toggleClass("hidden");
            })
            .catch(console.error)
            .build()
            .execute();
    }

    private showDialog() {
        const element = (this as any);

        element
            .query()
            .where(".dialog")
            .then((dialog: any) => {
                dialog.toggleClass("hidden");
            })
            .catch(console.error)
            .build()
            .execute();
    }

    private close() {
        this.showDialog();
        this.showBack();
    }

}


@WebComponent({
    selector: 'cw-modal',
    //language=HTML
    template: `
        <div toggle class="back blur hidden"></div>
        <div toggle class="dialog hidden">
            <slot></slot>
        </div>
    `,
    //language=CSS
    style: `
        .hidden {
            display: none !important;
        }

        .back {
            background: none;
            border: none;
            display: flex;
            left: 0;
            top: 0;
            position: fixed;
            z-index: 19;
            height: 100%;
            width: 100%;
        }

        .dialog {
            background: none;
            border: none;
            display: flex;
            left: 0;
            top: 0;
            position: fixed;
            z-index: 20;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 100%;
        }


        button {
            min-width: 100px;
            text-align: center;
        }
    `
})
export class ModalComponent extends HTMLElement {
    public data: any;

    public toggle(): void {
        const element = (this as any);
        console.log("TOGGING");
        element
            .query()
            .where(".dialog")
            .then((dialog: any) => {
                this.showDialog();
                this.showBack();
            })
            .catch(console.error)
            .build()
            .execute();
    }

    private showBack() {
        const element = (this as any);

        element
            .query()
            .where(".back")
            .then((dialog: any) => {
                dialog.toggleClass("hidden");
            })
            .catch(console.error)
            .build()
            .execute();
    }

    private showDialog() {
        const element = (this as any);

        element
            .query()
            .where(".dialog")
            .then((dialog: any) => {
                dialog.toggleClass("hidden");

                (this as any).update();
            })
            .catch(console.error)
            .build()
            .execute();
    }

}
