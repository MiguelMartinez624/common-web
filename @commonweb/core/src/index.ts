import {CustomElementConfig} from "./web_components";
import {ComponentBuilder} from "./builder";


export * from './interpolations';
export * from './web_components';
export * from './html_manipulation';
export * from './attributes';
export * from './components';
export * from './bindings';



// Need to register the builder to be able to extends all this features this way
window['RegisterWebComponent'] = (config: CustomElementConfig) => {
    return new ComponentBuilder(config);
}
