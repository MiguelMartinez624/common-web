import {QueryBuilder} from "../html_manipulation";
import {IComponent} from "./icomponent";

export interface WithHTMLController {
    query<T>(): QueryBuilder<T>;
}


function query<T>(): QueryBuilder<T> {
    return new QueryBuilder<T>().from(this as unknown as Node);
}


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

export const QueriesKey = "web_common_pending_queries";

export function QueryElement(pattern: string) {
    return function (target: any, propertyKey: string) {
        if (!target[QueriesKey]) {
            target[QueriesKey] = new Map<string, string>();
        }
        target[QueriesKey].set(pattern, propertyKey);
    };
}

export class QueryResult<T> {
    private _element: T;

    constructor(
        public readonly queryString: string,
        public readonly root: any) {

    }

    public unwrap(): T {
        if (this._element) {
            return this._element;
        }
        new QueryBuilder<T>().from(this.root as unknown as Node)
            .where(this.queryString)
            .catch(console.error)
            .then((result) => {
                this._element = result;
            })
            .build()
            .execute();


        return this._element;
    }
}

