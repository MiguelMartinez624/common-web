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




@WebComponent({
    style: `
      /* The snackbar - position it at the bottom and in the middle of the screen */
#snackbar {
    visibility: hidden; /* Hidden by default. Visible on click */
    min-width: 250px; /* Set a default minimum width */
    margin-left: -125px; /* Divide value of min-width by 2 */
    background-color: #333; /* Black background color */
    color: #fff; /* White text color */
    text-align: center; /* Centered text */
    border-radius: 2px; /* Rounded borders */
    padding: 16px; /* Padding */
    position: fixed; /* Sit on top of the screen */
    z-index: 1; /* Add a z-index if needed */
    left: 50%; /* Center the snackbar */
    bottom: 30px; /* 30px from the bottom */
}

/* Show the snackbar when clicking on a button (class added with JavaScript) */
#snackbar.show {
    visibility: visible; /* Show the snackbar */
    /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
    However, delay the fade out process for 2.5 seconds */
    -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
    animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

/* Animations to fade the snackbar in and out */
@-webkit-keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
}

@keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
}
    `,
    template: `
        <div id="snackbar">
             <slot></slot>
        </div>
    `,
    selector: 'snackbar-component'
})
export class SnackbarComponent extends HTMLElement {
    public toggle() {
        const panel = this.shadowRoot.getElementById("snackbar");
        panel.classList.add("show")
        setTimeout(()=> panel.classList.remove("show"), 3000);

    }
}