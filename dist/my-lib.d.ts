declare module "core/field_decorators" {
    export interface PropagationConfig {
        selector: string;
        fieldType?: 'property' | 'attribute';
        inputName: string;
    }
    export function PropagateToChild(param: PropagationConfig): (target: any, propertyKey: string) => void;
}
declare module "core/events" {
    export type EventPattern = string;
    export type EventMap = {
        [key: EventPattern]: Function;
    };
    export interface ElementWithEventsStack {
        callback_bind_stack: EventMap;
    }
    type HTMLElementWithEventStack = HTMLElement & ElementWithEventsStack;
    export function EventBind(values: string): (target: HTMLElement, propertyKey: string, descriptor: PropertyDescriptor) => void;
    export function attemptBindEvents(element: HTMLElement): void;
    export function bindEvents(target: HTMLElementWithEventStack): void;
}
declare module "core/storage" {
    export function FromStorage(name: string): (target: any, propertyKey: string) => void;
    export function subscribeToKeyChange(key: string, handler: any): void;
    export function changeStorageValue(key: string, value: any): void;
    export function syncWithStorage(target: any): void;
}
declare module "core/components" {
    interface CustomElementConfig {
        selector: string;
        template: string;
        style?: string;
    }
    export function WebComponent(attr: CustomElementConfig): <T extends new (...args: any[]) => {}>(constr: T) => {
        new (...args: any[]): {
            casted: any;
            attributeChangedCallback(name: any, oldValue: any, newValue: any): any;
        };
    } & T;
    export function isJSON(str: any): boolean;
}
declare module "core/html_manipulation" {
    export function findNodeOnUpTree(selector: string, element: Node): Node | null;
}
declare module "core/attributes" {
    export function Attribute(name: string): (target: any, propertyKey: string) => void;
}
declare module "core/index" {
    export * from "core/field_decorators";
    export * from "core/components";
    export * from "core/html_manipulation";
    export * from "core/storage";
    export * from "core/events";
    export * from "core/attributes";
}
declare module "index" {
    export * from "core/index";
}
