import {FrameworkComponent} from "./framework-component";

/**
 * Finds the nearest ancestor node matching the specified selector,
 * starting from the given node and traversing upwards the DOM tree.
 * This function also handles the special case of `@host` to find closest FrameworkComponent
 *
 *
 * @param {string} selector - The CSS selector to use for finding the node.
 * @param {Node} element - The starting element for the search.
 * @returns {Node | null} The first matching ancestor node, or null if not found.
 *
 * @throws {Error} If an error occurs during the search, including a descriptive object with:
 *   - query: The selector that was used.
 *   - root: The starting element for the search.
 *    error: The underlying error object.
 */
export function findNodeOnUpTree(selector: string, element: Node): Node | null {
    try {
        if (selector === "@host") {
            let queryResult = element.parentNode as Node;
            if ((queryResult.parentNode !== null) && !(queryResult instanceof FrameworkComponent)) {
                queryResult = findNodeOnUpTree(selector, queryResult);
            } else if (queryResult['host']) {
                return queryResult['host'];
            }

            return queryResult
        }

        if (selector === "@parent") {
            return (element.parentNode)
        }
        // if not one of the key work replace
        if (selector[0] === "@") {
            selector = selector.slice(selector.indexOf("@") + 1);
        }

        let queryResult: Node = (element as HTMLElement).querySelector(selector);
        if (!queryResult && element.parentNode !== null) {
            queryResult = findNodeOnUpTree(selector, element.parentNode)
        } else if (!queryResult && element['host'] && element instanceof DocumentFragment) {
            return (element as any).host;
        }
        return queryResult;
    } catch (e) {

        throw {
            query: selector,
            root: element,
            error: e
        }
    }
}


/**
 * Finds all child nodes within the given element and its shadow DOM
 * that match the specified selector.
 *
 * @param {HTMLElement} tree - The element to search within.
 * @param {string} selector - The CSS selector to match.
 * @returns {HTMLElement[]} An array of all matching child nodes.
 */
export function findAllChildrensBySelector(tree: HTMLElement, selector: string): HTMLElement[] {
    const onShadow = tree.shadowRoot ? tree.shadowRoot.querySelectorAll(selector) : [];
    return [...tree.querySelectorAll(selector), ...onShadow]
}


/**
 * Extracts data from the provided object based on the specified path.
 * Supports accessing nested properties and handles the "@host" case for web components.
 *
 * @param {string|string[]} resultPath - The path to the desired data, either a dot-separated string or an array of property names.
 * @param {any} obj - The object from which to extract data.
 * @returns {any} The extracted data, or undefined if not found.
 */
export function extractData(resultPath: string, obj: any) {

    let properties = Array.isArray(resultPath) ? [resultPath] : resultPath.split(".")
        .filter((p) => p !== "@host")
    return properties.reduce((prev: any, curr: any) => prev?.[curr], obj)
}

// // Usage example
// const query = new QueryBuilder<HTMLElement>()
//     .from(document.body)
//     .where('#my-element')
//     .then(element => console.log(element))
//     .catch(error => console.error(error))
//     .build();
//
// query.execute();
export class QueryBuilder<T> {
    private sourceElement: Node | null = null;
    private selector: string | null = null;
    private successHandler: ((result: T) => void) | null = null;
    private errorHandler: ((error: string) => void) | null = null;

    // Define methods to set properties
    public from(sourceElement: Node): QueryBuilder<T> {
        this.sourceElement = sourceElement;
        return this;
    }

    public where(selector: string): QueryBuilder<T> {
        this.selector = selector;
        return this;
    }

    public then(successHandler: (result: T) => void): QueryBuilder<T> {
        this.successHandler = successHandler;
        return this;
    }

    public catch(errorHandler: (error: string) => void): QueryBuilder<T> {
        this.errorHandler = errorHandler;
        return this;
    }

    // Build the Query object
    public build(): Query<T> {
        if (!this.sourceElement || !this.selector || !this.successHandler || !this.errorHandler) {
            throw new Error('Missing required properties for Query construction.');
        }

        return new Query<T>(this.sourceElement, this.selector, this.successHandler, this.errorHandler);
    }
}


export class Query<T> {
    constructor(
        private readonly sourceElement: Node,
        private readonly selector: string,
        private readonly successHandler: (result: T) => void,
        private readonly errorHandler: (error: string) => void) {
    }

    public execute(): void {
        // do queery
        const result = findNodeOnUpTree(this.selector, this.sourceElement);
        if (!result) {
            return this.errorHandler(`could not found element under selector ${this.selector}`);
        }

        this.successHandler(result as unknown as T);
    }
}
