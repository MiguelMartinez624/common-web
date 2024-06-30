import {WebComponent} from "@commonweb/core";


@WebComponent({
    selector: "expense-card",
    //language=CSS
    style: `
        :host {
            display: block;
            margin: 15px 0px;
            position: relative;
        }

        .card {
            outline-offset: 4px;
            outline: var(--card-outline);
            border-radius: 5px;
            background: var(--card-bg);
            color: var(--card-fc);
        }

        .flex {
            display: flex;
        }

        .card-icon {
            height: 2rem;
            width: 2rem;
            border-radius: 50%;
            padding: 1rem;
        }

        .flex-centered {
            justify-content: center;
            align-items: center;
        }

        .title {
            font-weight: bold;
        }

        .text-end {
            text-align: end;

        }

        .sub-title {
            opacity: 0.7;
            font-size: 14px;
        }

        ul {
            list-style: none;
            padding: 0;
            width: 60vw;
            margin: 0;
        }

        .hidden {
            display: none
        }

        [options] {
            z-index: 4;
            position: absolute;
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
            right: 0px;
            top: 54px;
        }

        li {
            font-weight: bold;
        }

        .line {
            height: 1px;
            width: 100%;
            background: white;
        }

        .gap {
            gap: 1.5rem;
        }`,
    //language=HTML
    template: `
        <!--        <template for-each="">-->
        <div class="card flex gap flex-centered">
            <div style="flex: 0.3;">
                <!--icon for topic-->
                <div class="card-icon flex flex-centered">
                    {{@host:category}}

                </div>
            </div>
            <div style="flex: 1;justify-content: space-between;" class="flex ">
                <div>
                    <!--Content-->
                    <div class="title"><span>{{@host:[data.title]}}</span></div>
                    <div class="sub-title"><span>{{@host:[data.description]}}</span></div>
                </div>
                <div class="flex gap flex-centered">
                    <div class="text-end">
                        <div class="title"><span>{{@host:amountFormatted}}</span></div>
                        <!--                        <div class="sub-title"><span>{{@host:dateFormatted}}</span></div>-->
                    </div>
                    <div style="padding: 10px">
                        <cw-menu-dots-icon menu style="width:20px;height: 20px; "></cw-menu-dots-icon>
                        <bind-element value="hidden" from="[menu]:(click)" to="[options]:toggleClass"></bind-element>
                    </div>
                </div>
            </div>
            <div options toggle class=" hidden">
                <!--Actions-->
                <ul>
                    <li style="background:rgb(60 130 246); padding:1rem">
                        Edit Item
                    </li>
                    <div class="line"></div>
                    <li style="background:rgb(234,52,52); padding:1rem" delete>
                        Delete Item
                        <bind-element from="[delete]:(click)" to="@host:delete"></bind-element>
                        <bind-element value="hidden" from="[delete]:(click)" to="[options]:toggleClass"></bind-element>
                    </li>

                </ul>

            </div>

        </div>
        <!--        </template>-->
    `
})
export class ExpenseCardComponent extends HTMLElement {
    public data: any

    category() {
        if (!this.data) {
            return ""
        }
        const cariCon = this.shadowRoot.querySelector(".card-icon")

        switch (this.data.category) {
            case "car":
                cariCon.innerHTML = '<cw-car-icon></cw-car-icon>'
                break
            case "entertainment":
                cariCon.innerHTML = '<cw-gamepad-icon></cw-gamepad-icon>'
                break
            case "food":
                cariCon.innerHTML = '<cw-shopping-car-icon></cw-shopping-car-icon>'
                break;
            case "Initial":
                cariCon.innerHTML = '<cw-building-icon></cw-building-icon>'
                break
            default:
                cariCon.innerHTML = '<cw-shopping-car-icon></cw-shopping-car-icon>'

        }


    }

    delete(params) {
        this.dispatchEvent(new CustomEvent("delete", {detail: this.data.id}))
    }

    dateFormatted() {
        if (this.data) {
            return new Date(this.data.date).toLocaleDateString();
        }
        return "00/00/0000"
    }


    amountFormatted() {
        if (this.data) {
            return this.data.amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
        }
        return "$00.00";
    }


}
