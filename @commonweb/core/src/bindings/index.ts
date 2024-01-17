import {ElementBind} from "./element_bind";
import {LocalStorageBind} from "./localstorage_bind";


export function bindFromString(bindingStr: string): ElementBind | LocalStorageBind {
    // for elements binding
    if (bindingStr.startsWith("@")) {
        return new ElementBind(bindingStr.slice(1));
    }

    if (bindingStr.startsWith("storage://")) {
        return new LocalStorageBind(bindingStr);
    }

    return
}