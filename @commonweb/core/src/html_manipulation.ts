

// findNodeOnTree traverse the element tree to find the Node with the given seelctor
// otherwise will return null
export function findNodeOnUpTree(selector: string, element: Node): Node | null {
    let queryResult: Node = (element as HTMLElement).querySelector(selector);
    if (!queryResult && element.parentNode !== null) {
        queryResult = findNodeOnUpTree(selector, element.parentNode)
    }
    return queryResult;
}
