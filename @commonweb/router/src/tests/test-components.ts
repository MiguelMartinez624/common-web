import {WebComponent} from "@commonweb/core";


@WebComponent({
    selector: 'hello-world',
    template: '<h4>Hello World!</h4>'
})
export class TestComponent extends HTMLElement {
}

@WebComponent({
    selector: 'hello-world-second',
    template: '<h4>Hello Second Component</h4><'
})
export class TestComponentSubscribeToLocalStorage extends HTMLElement {
}


@WebComponent({
    selector: 'hello-world-with-param',
    template: '<h4>Hello Second Component</h4><'
})
export class TestComponentWithParam extends HTMLElement {
}

