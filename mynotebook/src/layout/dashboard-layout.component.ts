import {WebComponent} from "@commonweb/core";

@WebComponent({
    selector: 'cw-dashboard-layout',

    // language=CSS
    style: `
        .sidebar {
            border-right: 1px solid #80d674;
        }

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

            background-size: 40px 40px;
            background-position: -19px -19px;

            height: 100%;
        }

        .layout {
            overflow: hidden;
            height: 100%;
            display: flex;
            width: 100%;
        }


        @media only screen and (max-width: 800px) {
            .layout {
                flex-direction: column-reverse;
            }

            .sidebar {
                border: none;
            }

            .content {
                padding: 1rem;
            }

            .sidebar.collapsed {
                transition-property: width;
                transition-duration: 0.2s;
                width: 80%;
            }


        }

        .hidden {
            display: none;
        }


        .cursor-pointer {
            cursor: pointer;
        }
    `, //language=HTML
    template: `

        <div class="layout" style="display: flex;">
            <div toggle class="sidebar ">
                <slot name="nav"></slot>
            </div>
            <div style="flex:1;overflow:hidden;">
                <div class="content lg:px-40 sm:px-20 leading-8">
                    <slot name="content"></slot>
                </div>
            </div>

        </div>
    `
})
export class DashboardLayout extends HTMLElement {

}
