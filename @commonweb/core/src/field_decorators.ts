
export interface PropagationConfig {
    selector: string,
    fieldType?: 'property' | 'attribute';
    inputName: string
}

export function PropagateToChild(param: PropagationConfig) {
    //TODO can be generic as we repeat it a lot
    return function (target: any, propertyKey: string) {

        if (!target['property_to_propagate']) {
            target['property_to_propagate'] = new Map<string, PropagationConfig>();
        }
        // console.log({param})
        target['property_to_propagate'].set(`${propertyKey}`, param);
    };
}
