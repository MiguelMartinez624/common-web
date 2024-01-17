import {ElementBind} from "./element_bind";
import {LocalStorageBind} from "./localstorage_bind";


export function bindFromString(bindingStr: string): ElementBind | LocalStorageBind {
    // for elements binding
    if (bindingStr.startsWith("@")) {
        return new ElementBind(bindingStr.slice(1));
    }

    if (bindingStr.startsWith("localstorage=")) {
        return new LocalStorageBind(bindingStr);
    }

    throw "bindingStr dont match any binding"
}