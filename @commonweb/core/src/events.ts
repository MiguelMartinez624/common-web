// EventPattern its a string representing a [cssSelector]:event
import {findManyNodeOnUpTree} from "./html_manipulation";

export type EventPattern = string;

export type EventMap = { [key: EventPattern]: Function };

export interface ElementWithEventsStack {
    callback_bind_stack: EventMap;
}
export interface ElementWithBulkEventsStack {
    callback_bind_all_stack: EventMap;
}



const eventMapName = 'callback_bind_stack';
const eventBulkMapName = 'callback_bind_all_stack';

type HTMLElementWithEventStack = HTMLElement & ElementWithEventsStack;
type HTMLElementWithBulkEventStack = HTMLElement & ElementWithBulkEventsStack;

function isHTMLElementWithEventStack(element: HTMLElement | HTMLElementWithEventStack): boolean {
    return eventMapName in (element as ElementWithEventsStack);
}

function isHTMLElementWithAllEventStack(element: HTMLElement | ElementWithBulkEventsStack): boolean {
    return eventBulkMapName in (element as ElementWithBulkEventsStack);
}


// EventBind Decorator attach the
export function EventBind(values: string) {
    return function (target: HTMLElement, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!isHTMLElementWithEventStack(target)) {
            target[eventMapName] = {};
        }
        const method = target[propertyKey];
        (target as HTMLElementWithEventStack).callback_bind_stack [`${values}`] = method
    };
}

export function EventBindAll(values: string) {
    return function (target: HTMLElement, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!isHTMLElementWithAllEventStack(target)) {
            target[eventBulkMapName] = {};
        }
        const method = target[propertyKey];
        (target as HTMLElementWithBulkEventStack).callback_bind_all_stack[`${values}`] = method;
    };
}


export function attemptBindEvents(element: HTMLElement) {
    if (isHTMLElementWithEventStack(element)) {
        bindEvents(element as HTMLElementWithEventStack);
    }

    if(isHTMLElementWithAllEventStack(element)){
        bindOnAllEvents(element as HTMLElementWithBulkEventStack);
    }
}

export function bindEvents(target: HTMLElementWithEventStack) {

    Object.keys(target.callback_bind_stack).forEach((key: string) => {

        const sections = key.split(":");
        const method = target.callback_bind_stack[key];

        if (sections[0].startsWith("window")) {
            const event = sections[1];
            window.addEventListener(event, method.bind(target))
        } else {
            const element = target.shadowRoot.querySelectorAll(sections[0]);
            if (element) {
                element.forEach((ele) => {
                    ele.addEventListener(sections[1], method.bind(target))
                });

                //TODO remove listener
            }

        }
    })
}

export function bindOnAllEvents(target: HTMLElementWithBulkEventStack) {
    console.log(target.callback_bind_all_stack)
    Object.keys(target.callback_bind_all_stack).forEach((key: string) => {
        const sections = key.split(":");
        const method = target.callback_bind_all_stack[key];

        if (sections[0].startsWith("window")) {
            const event = sections[1];
            window.addEventListener(event, method.bind(target))
        } else {

            const element = findManyNodeOnUpTree(sections[0],target);
            if (element.length > 0) {
                element.forEach((ele) => {
                    console.log(ele)
                    ele.addEventListener(sections[1], method.bind(target))
                });
                //TODO remove listener
            }else {
                console.log("no found")
            }

        }
    })
}