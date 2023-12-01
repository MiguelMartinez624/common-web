import {Attribute, EventBind, EventBindAll, WebComponent} from "@commonweb/core";
import {pushUrl} from "@commonweb/router";
import "@commonweb/components";
import "@commonweb/forms";
import "@commonweb/data";
import {Icon} from "@commonweb/components";
import "./backoffice-entity.page";
import "./side-panel";
import "./orders-managment.page";
import "./logo"
export * from "./builder";


@WebComponent({
    selector: 'navigation-list',
    template: `  <brand-icon-component></brand-icon-component>      <ul>
                 
                </ul>
                 `,
    style: `
        :host{
            display:block;
            border-right: 1px solid var(--border-line-color, rgba(28, 28, 28, 0.10)); 
            height: 100%;
            width: 100%;
            text-align:center;
            padding-top:15px;
        }
      ul {
        text-align:start;
        list-style: none;
        height: 100%;
        padding: 1.2rem;
        margin:0px;
      }
      
      li{
      display:flex;
      align-items:center;
      gap:5px;
        font-size: 18px;
        font-style: normal;
        font-weight: 400;
        padding-top:0.5rem;
        padding-bottom:0.5rem;
      }
    `
})
export class NavigationListComponent extends HTMLElement {
    public addRoute(title: string, path: string, icon: string) {
        const li = document.createElement("li");
        li.setAttribute("route", path);
        li.innerHTML = icon && icon !== "undefined" ? `<tt-icon icon="${icon}"></tt-icon>` + ` ${title}` : title;


        li.addEventListener("click", () => {
            window.history.pushState({}, title, `${window.location.origin}/${path}`)
            window.dispatchEvent(new Event('popstate'));
        });
        this.shadowRoot.querySelector("ul")
            .appendChild(li);
    }


    @EventBind("li[route]:click")
    public navigateProducts(ev) {
        const route = ev.target.getAttribute("route");
        pushUrl(route);
    }


}


@WebComponent({
    selector: 'ecommerce-backoffice-app',
    template: `
            <dashboard-layout>
                <bind-element from="nav-header:(click)" to="dashboard-layout:toggleSidebar"></bind-element>
                <navigation-list slot="sidebar"></navigation-list>
                <nav-header slot="header"></nav-header>
                <go-router  slot="content"> </go-router>
          
            </dashboard-layout>`
})
export class ECommerceBackOffice extends HTMLElement {

    connectedCallback() {

        const routes = JSON.parse(this.getAttribute("routes"))
        const router = this.shadowRoot.querySelector("go-router");
        const navigationList = this.shadowRoot.querySelector("navigation-list");

        if (router) {
            routes.forEach(c => {
                (navigationList as NavigationListComponent).addRoute(c.title, c.route, c.icon)
                const route = document.createElement("go-route");
                route.setAttribute("route", c.route);
                route.setAttribute("component", c.component);
                route.setAttribute("default", "true");

                router.appendChild(route);

            })
        }
    }

    @EventBind('action-bar:option-selected')
    public handleNavbarEvent(ev) {
        const data = ev.detail.data;
        pushUrl(data.icon);
    }

}


@WebComponent({
    selector: "dashboard-layout",
    template: `
        <div class="container">
           <div class="sidebar"><slot name="sidebar"></slot></div>
           <div style="flex:1;overflow:hidden;">
                <div class="header"><slot name="header"></slot></div>
                <div class="content"><slot name="content"></slot></div>   
           </div>
            
        </div>
    `,
    style: `
        .header{height:60px;}
        .content{
             padding:1rem;
        }
        .container{
            overflow:hidden;
            height:100%;
            display:flex;
            overflow:hidden;
         }
         .sidebar{  
            display:flex;
            width:100%;
            background:var(--bg-primary);
            flex:0.2;
            transition-property: flex;
            transition-duration:0.5s;
            justify-center:center;
            overflow:hidden;
         }
         .sidebar.collapsed{
                  transition-property: flex;
                  transition-duration:0.5s;
                  flex:0;
         }
         .collapsed{
            flex:0;
           
         }`
})
export class DashboardLayout extends HTMLElement {


    public toggleSidebar() {
        const sidebar = this.shadowRoot.querySelector(".sidebar");
        if (sidebar) {
            sidebar.classList.toggle("collapsed");
        }
    }
}

@WebComponent({
    selector: 'nav-header',
    template: `
        <header>
            <tt-icon icon="menu"></tt-icon>
        </header>
         <div class="content"><slot name="content"></slot></div>
    `,
    style: `
        .content{
            display: none;
            position:absolute;
            width:100%;
            background-color:var(--bg-primary,#322f2f);

        }
        
        ::slotted(a) {
          color: white;
          padding: 14px 16px;
          text-decoration: none;
          font-size: 17px;
          display: block;
        }

 
        
        tt-icon{ font-size:40px;cursor:pointer;}
        header{
            justify-content: space-between;
            padding:0 1.5rem ;
            color: white;
            display:flex;
            align-items:center;
            background-color:var(--bg-primary,#322f2f);
            height:99%;
            border-bottom: 1px solid var(--border-line-color, rgba(28, 28, 28, 0.30));
        }
    `
})
export class NavHeader extends HTMLElement {
    @EventBind("tt-icon:click")
    public toggleContent(): void {
        const contentEle = (this.shadowRoot.querySelector("div.content") as unknown as HTMLElement);
        if (contentEle.style.display === "block") {
            contentEle.style.display = "none";
        } else {
            contentEle.style.display = "block";
        }
    }
}

@WebComponent({
        selector: 'go-card',
        template: `<slot></slot>`,
        style: `:host{
                border-radius: var(--card-border-radius,0px);
                display:flex;
                padding:1rem;
                background-color:var(--bg-primary,#322f2f);
                box-shadow: 0px 0px 8px rgba(0,0,0,.6)}`
    }
)
export class Card extends HTMLElement {
}

