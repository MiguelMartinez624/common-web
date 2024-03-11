/**
 * Finds the nearest ancestor node matching the specified selector,
 * starting from the given node and traversing upwards the DOM tree.
 * This function also handles the special case of `@host` to find the web component itself.
 *
 * @param {string} selector - The CSS selector to match.
 * @param {Node} element - The node from which to start searching.
 * @returns {Node | null} The nearest ancestor node matching the selector,
 *   or null if not found.
 */
import {FrameworkComponent} from "./framework-component";

export function findNodeOnUpTree(selector: string, element: Node): Node | null {
    /*
    * Search the root element is the web component itself
    * */

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
    // if not one of the key workds resplace
    if (selector[0] === "@") {
        selector = selector.slice(selector.indexOf("@") + 1);
    }

    let queryResult: Node = (element as HTMLElement).querySelector(selector);
    if (!queryResult && element.parentNode !== null) {
        queryResult = findNodeOnUpTree(selector, element.parentNode)
    }else if (!queryResult && element['host'] && element instanceof DocumentFragment) {
        return element['host'];
    }
    return queryResult;
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
 * @param {any} result - The object from which to extract data.
 * @returns {any} The extracted data, or undefined if not found.
 */
export function extractData(resultPath: string, result: any) {

    let properties = Array.isArray(resultPath) ? [resultPath] : resultPath.split(".")
        .filter((p) => p !== "@host")
    return properties.reduce((prev: any, curr: any) => prev?.[curr], result)
}
