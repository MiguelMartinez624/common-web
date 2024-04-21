import {IComponent} from "../icomponent";
import {QueryBuilder} from "../html_manipulation";

export class HtmlControllerComponent implements IComponent {
    private _root: any;

    onInit(): void {
    }

    onUpdate(): void {
    }

    setup(target: any): void {
        this._root = target;
        Object.defineProperty(target, "query", {
            value: query,
            writable: false,
            enumerable: true
        });
    }


}

function query<T>(): QueryBuilder<T> {
    return new QueryBuilder<T>().from(this as unknown as Node);
}
