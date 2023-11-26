import {Attribute, EventBind, EventBindAll, WebComponent} from "@commonweb/core";
import {pushUrl} from "@commonweb/router";
import "@commonweb/components";
import "@commonweb/forms";
import "@commonweb/data";
import {Icon} from "@commonweb/components";
import "./backoffice-entity.page";
import "./side-panel";
import "./orders-managment.page";

export * from "./builder";


@WebComponent({
    selector: 'navigation-list',
    template: `             <svg width="89" height="22" viewBox="0 0 89 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M88.9935 14.6179C88.9935 15.7113 88.6832 16.5678 88.0627 17.1875C87.4422 17.8072 86.5849 18.117 85.4907 18.117H80.4559C79.3613 18.117 78.5037 17.8072 77.8832 17.1875C77.2628 16.5678 76.9527 15.7113 76.9531 14.6179V9.58795C76.9531 8.49417 77.2632 7.63765 77.8832 7.01838C78.5033 6.39911 79.3609 6.08927 80.4559 6.08887H85.4907C86.5849 6.08887 87.4422 6.3987 88.0627 7.01838C88.6832 7.63805 88.9935 8.49458 88.9935 9.58795V14.6179ZM85.162 9.91609C85.162 9.33301 84.8702 9.04147 84.2867 9.04147H81.6598C81.0755 9.04147 80.7836 9.33301 80.784 9.91609V14.2898C80.784 14.8729 81.076 15.1644 81.6598 15.1644H84.2867C84.8698 15.1644 85.1616 14.8729 85.162 14.2898V9.91609Z" fill="#003A5D"/>
<path d="M50.5511 14.9482C51.3237 14.9482 52.1993 14.8024 53.178 14.5109V6.30994H57.0089V17.8983H53.397V16.8066C52.7466 17.2424 52.0344 17.578 51.2842 17.802C50.5621 18.013 49.9522 18.1187 49.4545 18.1191H48.4713C47.4792 18.1191 46.6838 17.8203 46.0853 17.2225C45.4868 16.6248 45.1875 15.8309 45.1875 14.8408V6.30994H49.0184V14.1827C49.016 14.284 49.0343 14.3847 49.072 14.4787C49.1097 14.5727 49.1661 14.6581 49.2378 14.7296C49.3095 14.8012 49.3949 14.8575 49.489 14.895C49.5831 14.9326 49.6838 14.9507 49.785 14.9482H50.5511Z" fill="#003A5D"/>
<path d="M67.7612 17.8984V21.6189H63.9297V6.31002H67.7691V7.40299C68.4546 6.95166 68.9316 6.61986 69.6537 6.40822C70.3759 6.19658 70.9852 6.09106 71.4835 6.09106H72.4685C73.461 6.09106 74.2566 6.38992 74.8551 6.98764C75.4536 7.58536 75.7527 8.37987 75.7523 9.37119V14.4012C75.7523 15.4949 75.4422 16.3515 74.8222 16.9707C74.2021 17.59 73.3445 17.8998 72.2495 17.9002L67.7612 17.8984ZM70.3881 9.26018C69.6155 9.26018 68.7399 9.40595 67.7612 9.69749V14.9464H71.0444C71.6278 14.9464 71.9198 14.6547 71.9202 14.0712V10.0256C71.9225 9.92442 71.9043 9.82378 71.8666 9.72982C71.829 9.63585 71.7726 9.55051 71.701 9.47895C71.6294 9.40739 71.544 9.35111 71.45 9.31351C71.356 9.27591 71.2553 9.25777 71.1541 9.26018H70.3881Z" fill="#003A5D"/>
<path d="M58.4394 17.8964H62.6875V2.58816H58.4394V17.8964Z" fill="#003A5D"/>
<path d="M30.7344 2.59082H39.9288C41.461 2.59082 42.5736 2.93644 43.2669 3.62768C43.9602 4.31891 44.3058 5.43059 44.3038 6.96269V9.14985C44.3038 10.6807 43.9582 11.7924 43.2669 12.4849C42.5757 13.1773 41.463 13.5229 39.9288 13.5217H34.675V17.4471H30.7344V2.59082ZM40.3668 6.96452C40.3668 6.0899 39.9288 5.6526 39.053 5.6526H34.675V9.6018H39.053C39.9288 9.6018 40.3668 9.16449 40.3668 8.28987V6.96452Z" fill="#003A5D"/>
<path d="M11.075 2.07816C11.075 1.1409 10.3149 0.381104 9.37735 0.381104C8.43976 0.381104 7.67969 1.1409 7.67969 2.07816C7.67969 3.01541 8.43976 3.77521 9.37735 3.77521C10.3149 3.77521 11.075 3.01541 11.075 2.07816Z" fill="#003A5D"/>
<path d="M17.1297 2.07816C17.1297 1.1409 16.3696 0.381104 15.432 0.381104C14.4944 0.381104 13.7344 1.1409 13.7344 2.07816C13.7344 3.01541 14.4944 3.77521 15.432 3.77521C16.3696 3.77521 17.1297 3.01541 17.1297 2.07816Z" fill="#003A5D"/>
<path d="M22.0044 18.9652L19.2969 16.2462C20.439 15.1029 21.0806 13.5532 21.0806 11.9374C21.0806 10.3217 20.439 8.77197 19.2969 7.62869L22.0044 4.92212C23.8672 6.7844 24.9137 9.3101 24.9137 11.9437C24.9137 14.5772 23.8672 17.1029 22.0044 18.9652Z" fill="#003A5D"/>
<path d="M16.1607 18.9652L13.4531 16.2462C14.5938 15.1021 15.2342 13.5527 15.2342 11.9374C15.2342 10.3222 14.5938 8.77278 13.4531 7.62869L16.1607 4.92212C18.0227 6.7848 19.0687 9.31035 19.0687 11.9437C19.0687 14.577 18.0227 17.1025 16.1607 18.9652Z" fill="#003A5D"/>
<path d="M2.90696 18.9656C1.98534 18.0444 1.25427 16.9507 0.755494 15.747C0.256718 14.5433 0 13.2532 0 11.9503C0 10.6474 0.256718 9.35733 0.755494 8.15364C1.25427 6.94995 1.98534 5.85625 2.90696 4.935L5.61451 7.64157C4.47449 8.78269 3.83313 10.3288 3.8308 11.9415C3.82846 13.5542 4.46535 15.1022 5.60206 16.2466L2.90696 18.9656Z" fill="#003A5D"/>
<path d="M9.17258 18.9656C8.25096 18.0444 7.5199 16.9507 7.02112 15.747C6.52234 14.5433 6.26562 13.2532 6.26562 11.9503C6.26562 10.6474 6.52234 9.35733 7.02112 8.15364C7.5199 6.94995 8.25096 5.85625 9.17258 4.935L11.8801 7.64157C10.738 8.78485 10.0964 10.3346 10.0964 11.9503C10.0964 13.5661 10.738 15.1158 11.8801 16.2591L9.17258 18.9656Z" fill="#003A5D"/>
</svg> <ul>
                 
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
        Icon.iconsMap['sells'] = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M17.5 4.375V6.25H2.5V4.375C2.5 4.20924 2.56585 4.05027 2.68306 3.93306C2.80027 3.81585 2.95924 3.75 3.125 3.75H16.875C17.0408 3.75 17.1997 3.81585 17.3169 3.93306C17.4342 4.05027 17.5 4.20924 17.5 4.375Z" fill="#1C1C1C" fill-opacity="0.1"/>
            <path d="M16.875 3.125H3.125C2.79348 3.125 2.47554 3.2567 2.24112 3.49112C2.0067 3.72554 1.875 4.04348 1.875 4.375V15.625C1.875 15.9565 2.0067 16.2745 2.24112 16.5089C2.47554 16.7433 2.79348 16.875 3.125 16.875H16.875C17.2065 16.875 17.5245 16.7433 17.7589 16.5089C17.9933 16.2745 18.125 15.9565 18.125 15.625V4.375C18.125 4.04348 17.9933 3.72554 17.7589 3.49112C17.5245 3.2567 17.2065 3.125 16.875 3.125ZM16.875 4.375V5.625H3.125V4.375H16.875ZM16.875 15.625H3.125V6.875H16.875V15.625ZM13.75 8.75C13.75 9.74456 13.3549 10.6984 12.6517 11.4017C11.9484 12.1049 10.9946 12.5 10 12.5C9.00544 12.5 8.05161 12.1049 7.34835 11.4017C6.64509 10.6984 6.25 9.74456 6.25 8.75C6.25 8.58424 6.31585 8.42527 6.43306 8.30806C6.55027 8.19085 6.70924 8.125 6.875 8.125C7.04076 8.125 7.19973 8.19085 7.31694 8.30806C7.43415 8.42527 7.5 8.58424 7.5 8.75C7.5 9.41304 7.76339 10.0489 8.23223 10.5178C8.70107 10.9866 9.33696 11.25 10 11.25C10.663 11.25 11.2989 10.9866 11.7678 10.5178C12.2366 10.0489 12.5 9.41304 12.5 8.75C12.5 8.58424 12.5658 8.42527 12.6831 8.30806C12.8003 8.19085 12.9592 8.125 13.125 8.125C13.2908 8.125 13.4497 8.19085 13.5669 8.30806C13.6842 8.42527 13.75 8.58424 13.75 8.75Z" fill="#1C1C1C"/>
            </svg>`

        Icon.iconsMap['stock'] = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 6.25L7.66641 8C7.55822 8.08114 7.42664 8.125 7.29141 8.125H2.5V5C2.5 4.83424 2.56585 4.67527 2.68306 4.55806C2.80027 4.44085 2.95924 4.375 3.125 4.375H7.29141C7.42664 4.375 7.55822 4.41886 7.66641 4.5L10 6.25Z" fill="#1C1C1C" fill-opacity="0.1"/>
        <path d="M16.875 5.625H10.2086L8.04141 4C7.82472 3.83832 7.56176 3.75067 7.29141 3.75H3.125C2.79348 3.75 2.47554 3.8817 2.24112 4.11612C2.0067 4.35054 1.875 4.66848 1.875 5V15.625C1.875 15.9565 2.0067 16.2745 2.24112 16.5089C2.47554 16.7433 2.79348 16.875 3.125 16.875H16.875C17.2065 16.875 17.5245 16.7433 17.7589 16.5089C17.9933 16.2745 18.125 15.9565 18.125 15.625V6.875C18.125 6.54348 17.9933 6.22554 17.7589 5.99112C17.5245 5.7567 17.2065 5.625 16.875 5.625ZM3.125 5H7.29141L8.95859 6.25L7.29141 7.5H3.125V5ZM16.875 15.625H3.125V8.75H7.29141C7.56176 8.74933 7.82472 8.66168 8.04141 8.5L10.2086 6.875H16.875V15.625Z" fill="#1C1C1C"/>
            </svg>`
        Icon.iconsMap['extra'] = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M192 496C86 496 0 394 0 288C0 176 64 16 192 16s192 160 192 272c0 106-86 208-192 208zM154.8 134c6.5-6 7-16.1 1-22.6s-16.1-7-22.6-1c-23.9 21.8-41.1 52.7-52.3 84.2C69.7 226.1 64 259.7 64 288c0 8.8 7.2 16 16 16s16-7.2 16-16c0-24.5 5-54.4 15.1-82.8c10.1-28.5 25-54.1 43.7-71.2z"/></svg>`


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

