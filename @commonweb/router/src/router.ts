import {Attribute, EventBind, WebComponent} from "@commonweb/core";
import {notifyRouteChange} from "./decorators";
import {Route} from "./route";

export function pushUrl(href: string): void {
    history.pushState({}, '', href);
    notifyRouteChange(href, {});
    window.dispatchEvent(new Event('popstate'));
}

@WebComponent({
    selector: 'go-router',
    template: '<slot ></slot>'
})
export class Router extends HTMLElement {
    private currentRoute: any;

    connectedCallback() {
        if (!this.changePageByLocation()) {
            const defaultRoute: any = this.querySelector("go-route[default]");
            if (defaultRoute) {
                defaultRoute.setAttribute("show", "true");
                this.currentRoute = defaultRoute;
            } else {
                throw new Error("TODO implement what happend if any route match")
            }
        }
    }

    @EventBind("window:popstate")
    public setDefault() {
        this.changePageByLocation();
    }

    // Return true if the rute was actually changed
    private changePageByLocation(): boolean {
        const sections = window.location.pathname.split("/").filter(s=>s.trim()!=="");
        const routes = this.querySelectorAll("go-route");
        const pageToLoad = [...routes]
            .filter(eleent => eleent.getAttribute("route") !== undefined)
            .filter((f: Route) => f.getAttribute("route").split("/").filter(s=>s.trim()!=="").length === sections.length)
            // Search the first match with the pattern
            .find((f: Route) => {
                const routeSections = f.getAttribute("route").split("/").filter(s=>s.trim()!=="")
                for (let i = 0; i < routeSections.length; i++) {
                    const currentSection = routeSections[i];
                    if (currentSection.startsWith("{") && currentSection[currentSection.length - 1] === "}") {
                        continue;
                    }

                    if (currentSection !== sections[i]) {
                        return false
                    }
                }
                return true;

            });
        if (pageToLoad) {
            if (this.currentRoute) {
                this.currentRoute.setAttribute("show", 'false')
            }
            this.currentRoute = pageToLoad;

            pageToLoad.setAttribute("show", "true");
            return true;
        } else {
            return false;
        }
    }
}

