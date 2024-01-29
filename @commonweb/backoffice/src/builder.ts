import {DataFetcherConfiguration} from "@commonweb/data";

export class BackofficeRouteBuilder {
    private routes = [];

    addListingEndpoint(key: string, path: string, method: string, resultPath?: string) {
        window[`endpoint::${key}`] = {
            source: path,
            method: method,
            injectTo: [],
            resultPath: resultPath,
            fieldType: 'set',
            auto: true
        } as DataFetcherConfiguration;
        return this;
    }

    addEditEndpoint(key: string, path: string, method: string, resultPath?: string) {
        window[`endpoint::${key}`] = {
            source: path,
            injectTo: [],
            method: method,
            resultPath: resultPath,
            fieldType: 'attribute'
        } as DataFetcherConfiguration;
        return this;
    }

    addCreateEndpoint(key: string, path: string, method: string, resultPath?: string) {
        window[`endpoint::${key}`] = {
            source: path,
            method: method,
            injectTo: [],
            resultPath: resultPath,
            fieldType: 'attribute'
        } as DataFetcherConfiguration;
        return this;
    }

    addFormConfiguration(key, configuration) {
        localStorage.setItem(`://ui/${key}/form`, JSON.stringify(configuration));
        return this;
    }

    addTableConfiguration(key, configuration) {
        localStorage.setItem(`://ui/${key}/listing`, JSON.stringify(configuration));
        return this;
    }

    addRoute(route, icon, title, component, allowedRoles) {
        this.routes.push({
            route,
            icon,
            title,
            component,
            allowedRoles
        });
        return this;
    }

    build(selector) {

        let user = localStorage.getItem("user")
        if (user) {
            user = JSON.parse(user);
        }

        const routesHTML = this.routes
            .filter((r) => {
                if(!user){
                    return false;
                }
                if (r.allowedRoles) {
                    return r.allowedRoles.includes(user.role)
                } else {
                    // for every one
                    return true;
                }

            })
            .map((route) => {
                return `{
        "route": "${route.route}",
        "icon": "${route.icon}",
        "title": "${route.title}",
        "component": "${route.component}"
      }`;
            }).join(", ");

        const element = document.querySelector(selector);
        if (!element) {
            throw new Error("No se encontró ningún elemento con el selector especificado");
        }

        element.innerHTML =
            // language=HTML
            `
                <ecommerce-backoffice-app routes='[${routesHTML}]'>


                </ecommerce-backoffice-app>`;
    }
}