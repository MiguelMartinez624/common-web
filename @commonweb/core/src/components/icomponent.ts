
/**
 * @public
 * @interface IComponent
 *
 * This interface defines the lifecycle hooks for components within the framework.
 * Components implementing this interface are expected to provide implementations for these methods.
 */
export interface IComponent {
    /**
     * @public
     * @memberof IComponent
     * @description
     * This method is called during component initialization to set up the component's internal state.
     * It typically receives the component's root element as an argument.
     *
     * @param {any} target - The root element of the component.
     */
    setup(target: any): void;

    /**
     * @public
     * @memberof IComponent
     * @description
     * This method is called after the component is initialized and its view is created.
     * It's a good place to perform initial tasks like finding child elements or binding data.
     */
    onInit(): void;

    /**
     * @public
     * @memberof IComponent
     * @description
     * This method is called whenever the component's data changes or other events trigger updates.
     * It's a good place to re-render the component or update its state based on the changes.
     */
    onUpdate(): void;
}

export function appendComponent(target: any, component: any) {
    if (target.servers === undefined) {
        target.servers = [component];
    } else {
        target.servers.push(component);
    }
}
