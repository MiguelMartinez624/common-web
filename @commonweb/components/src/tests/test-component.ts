import {WebComponent} from "@commonweb/core";


@WebComponent({
    selector: 'test-component',
    template: `
        <conditional-render-cases state="default">
          <div case="hello">HELLO</div>
          <div case="world">WORLD</div>
          <div case="default">DEFAULT</div>
        </conditional-render-cases>
    `
})
export class TestComponent extends HTMLElement {
}

@WebComponent({
    selector: 'test-component-with-buttons',
    template: `
        <conditional-render-cases state="default">
          <div case="hello">HELLO</div>
          <div case="world">WORLD</div>
          <div case="default">DEFAULT</div>
        </conditional-render-cases>
        <div>
        
         <bind-element value="hello" from="tt-button[hello]:(click)" to="conditional-render-cases:[state]"></bind-element>
         <tt-button hello>Hello</tt-button>
         
         <bind-element value="world" from="tt-button[world]:(click)" to="conditional-render-cases:[state]"></bind-element>
         <tt-button world>World</tt-button>
         
         <bind-element value="default" from="tt-button[default]:(click)" to="conditional-render-cases:[state]"></bind-element>
         <tt-button default>Default</tt-button>
        </div>
    `
})
export class TestComponentWithButtons extends HTMLElement {
}


