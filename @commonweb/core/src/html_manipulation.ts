export function findNodeOnUpTree(selector: string, element: Node): Node | null {

    /*
    * Search the root element is the web component itself
    * */
    if (selector === "@host") {
        return (element.getRootNode() as any)?.host
    }

    let queryResult: Node = (element as HTMLElement).querySelector(selector);
    if (!queryResult && element.parentNode !== null) {
        queryResult = findNodeOnUpTree(selector, element.parentNode)
    }
    return queryResult;
}


export function extractData(resultPath: string, result: any) {
    let properties = Array.isArray(resultPath) ? [resultPath] : resultPath.split(".")
        .filter((p) => p !== "@host")
    return properties.reduce((prev: any, curr: any) => prev?.[curr], result)
}
