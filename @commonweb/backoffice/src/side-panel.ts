import {WebComponent} from "@commonweb/core";

@WebComponent({
    style: `
        .sidebar{
        height: calc(100% - 70px);
        width: 80%;
        background: rgba(0,0,0,0.8);
        position: absolute;
        top: 70px;
        right:-100%;
         transition-property: right;
        transition-duration:0.5s;
    }
    
    @media (max-width: 400px){
    .sidebar{
         width: 100%;
      }
    }
    
    .sidebar.expanded { right:0;}
    `,
    template: `
        <div class="sidebar">
             <slot></slot>
            
        </div>
    `,
    selector: 'side-panel'
})
export class SidePanel extends HTMLElement {
    public toggle() {
        const panel = this.shadowRoot.querySelector(".sidebar");
        panel.classList.toggle("expanded")
    }
}