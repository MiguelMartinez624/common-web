const routeMapName = "route_subscribed";

/*
* OnRouteChange method when the route change
* */
export function OnRouteChange(route: string) {
    return function (target: any, propertyKey: string) {
        if (!target[routeMapName]) {
            target[routeMapName] = new Map<string, any>();
        }
        target[routeMapName].set(route, target[propertyKey]);
    };

}

export function subscribeToKeyChange(route: string, handler: any): void {
    // TODO check how to remove listeners
    // window.removeEventListener()
    window.addEventListener(`route:${route}`, (ev: any) => {
        handler(ev.detail.data)
    });


    const currentRoute = window.location.href.split("/").pop();
    notifyRouteChange(currentRoute, {firstLoad: true})

}

export function notifyRouteChange(route: string, data: any): void {

    const changeEvent = new CustomEvent(`route:${route}`, {detail: {data: data}});
    window.dispatchEvent(changeEvent);
}

export function attachRouteListeners(target) {
    if (target[routeMapName]) {
        for (const [storageKey, method] of target[routeMapName]) {
            // ise this instead of the other one
            subscribeToKeyChange(storageKey, method.bind(target));
        }
    }
}

export function attachRouteListenersCleanUp(target) {
    if (target[routeMapName + '_clean_up']) {
        for (const [storageKey, method] of target[routeMapName]) {
            // ise this instead of the other one
            subscribeToKeyChange(storageKey, method.bind(target));
        }
    }
}


