// EventPattern its a string representing a [cssSelector]:event
export type EventPattern = string;

export type EventMap = { [key: EventPattern]: Function };

export interface ElementWithEventsStack {
    callback_bind_stack: EventMap;
}

const eventMapName = 'callback_bind_stack';
type HTMLElementWithEventStack = HTMLElement & ElementWithEventsStack;

function isHTMLElementWithEventStack(element: HTMLElement | HTMLElementWithEventStack): boolean {
    return eventMapName in (element as ElementWithEventsStack);
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

export function attemptBindEvents(element: HTMLElement) {
    if (isHTMLElementWithEventStack(element)) {
        bindEvents(element as HTMLElementWithEventStack);
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

