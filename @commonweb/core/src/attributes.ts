const AttributeMapKey = 'attribute_list';

/*
* Attribute attach a method call to an attribute change
* */
export function Attribute(name: string) {
    //TODO can be generic as we repeat it a lot
    // Register property
    return function (target: any, propertyKey: string) {
        if (!target[AttributeMapKey]) {
            target[AttributeMapKey] = new Map<string, any>();
        }

        const method = target[propertyKey];
        if (typeof method === "function") {
            target[AttributeMapKey].set(name, method);
        } else {
            target[AttributeMapKey].set(name, propertyKey);
        }
    };
}
