
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



// TODO Storage
// De forma reactiva cunado un valor ahi cambie llamar el metodo asi peudo hacer esas alocaciones
//o cambios modificando el storage directamente, pero tendria q usar un metodo para esto,
//seria storage y es local storage wrapper?


