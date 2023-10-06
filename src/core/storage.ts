import {isJSON} from "./components";


const storageKeyMapName = "storage_keys";

/*
* FromStorage get the current value from the local storage and will also call the method
* registered each time the values change
* */
export function FromStorage(name: string) {
    //TODO can be generic as we repeat it a lot
    return function (target: any, propertyKey: string) {
        if (!target[storageKeyMapName]) {
            target[storageKeyMapName] = new Map<string, any>();
        }

        //
        const method = target[propertyKey];

        target[storageKeyMapName].set(name, method);
    };

}


export function subscribeToKeyChange(key: string, handler: any): void {
    window.addEventListener(`storage-change:${key}`, (ev: any) => {
        handler(ev.detail.data)
    })
}

export function changeStorageValue(key: string, value: any): void {
    //TODO add reasibng why is necesary to trigger new event
    const changeEvent = new CustomEvent(`storage-change:${key}`, {detail: {data: value}});
    //Try catch
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(changeEvent);
}

export function syncWithStorage(target) {
    if (target[storageKeyMapName]) {
        for (const [storageKey, method] of target[storageKeyMapName]) {
            // ise this instead of the other one
            subscribeToKeyChange(storageKey, method.bind(target));
            const currentValue = localStorage.getItem(storageKey);
            invoque(method.bind(target), currentValue);

        }
    }
}

function invoque(method: Function, value: any) {
    if (value) {
        //TODO return the onject parsed on isJSON to avoid twice serialization
        if (isJSON(value)) {
            method(JSON.parse(value))
        } else {
            method(value)
        }

    }
}
