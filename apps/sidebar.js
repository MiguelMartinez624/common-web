if (window["RegisterWebComponent"]) {
    window
        .RegisterWebComponent({
            selector: 'cw-sidebar',

            // language=CSS
            style: `


                .header {
                    height: 60px;
                    display: flex;
                    align-items: center;
                    padding: 0 1rem;
                    color: var(--header-fc);
                    background: var(--header-bg);
                    border-bottom: var(--header-bottom);
                }

                .content {
                    padding: 1rem 3rem;
                    color: var(--content-fc);
                    background: var(--content-bg);

                    background-image: radial-gradient(#484848 1px, transparent 0);
                    background-size: 40px 40px;
                    background-position: -19px -19px;

                    height: calc(95%);
                }

                .layout {
                    overflow: hidden;
                    height: 100vh;
                    display: flex;
                    overflow: hidden;
                    width: 100%;
                }

                .sidebar {
                    display: flex;
                    width: 300px;
                    height: 100%;
                    background: var(--sidebar-bg);
                    color: var(--sidebar-fg);
                    transition-property: width;
                    transition-duration: 0.2s;
                    justify-center: center;
                    overflow: hidden;
                    border-right: var(--sidebar-border);
                }

                a {
                    color: var(--sidebar-fg);
                }

                .sidebar.collapsed {
                    transition-property: width;
                    transition-duration: 0.2s;
                    width: 0%;
                }


                @media only screen and (max-width: 768px) {
                    .sidebar {
                        z-index: 4;
                        width: 0%;
                        position: fixed;
                        display: block;
                        transition-property: width;
                        transition-duration: 0.2s;
                        left: -1px;
                    }

                    .content {
                        padding: 1rem;
                    }

                    .sidebar.collapsed {
                        transition-property: width;
                        transition-duration: 0.2s;
                        width: 80%;
                    }

                    .overlay.collapsed {
                        transition-property: width;
                        transition-duration: 0.2s;
                        width: 100%;
                    }

                }

                .hidden {
                    display: none;
                }

                .overlay {
                    height: 100%;
                    width: 0%;
                    position: fixed;
                    background: #7258585e;
                    z-index: 2;
                    filter: blur(12px);
                }

                .cursor-pointer {
                    cursor: pointer;
                }
            `, //language=HTML
            template: `

                <div class="layout">
                    <div toggle class="overlay  "></div>
                    <div toggle class="sidebar ">
                        <lazy-template data="{{@host:[_routes]}}" src="./sidebar.html"></lazy-template>
                    </div>
                    <div style="flex:1;overflow:hidden;">
                        <div class="header">
                             <span menu-toggle class="cursor-pointer">
                               <svg xmlns="http://www.w3.org/2000/svg" stroke="white"
                                    style="color: white;height: 30px;width: 30px" viewBox="0 0 448 512">
                                   
                                   <path fill="white"
                                         d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
                            </span>


                            <bind-element value="collapsed" from=".overlay:(click)"
                                          to=".overlay:toggleClass"></bind-element>
                            <bind-element value="collapsed" from=".overlay:(click)"
                                          to=".sidebar:toggleClass"></bind-element>

                            <bind-element value="collapsed" from="span[menu-toggle]:(click)"
                                          to=".overlay:toggleClass"></bind-element>
                            <bind-element value="collapsed" from="span[menu-toggle]:(click)"
                                          to=".sidebar:toggleClass"></bind-element>


                        </div>
                        <div class="content lg:px-40 sm:px-20 leading-8">
                            <slot name="content"></slot>
                        </div>
                    </div>

                </div>
            `
        })
        .with_attribute("routes", function (routes) {
            if (!routes) {
                return
            }
            this._routes = routes;
        })
        .build()
}
