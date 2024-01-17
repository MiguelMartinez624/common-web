import {PROCESSOR_KEY} from "./web_components";

export * from './field_decorators';
export * from './web_components';
export * from './html_manipulation';
export * from './storage';
export * from './events';
export * from './attributes';
export * from './components';

// if there are not any processor yet start the empty array;
if (!window[PROCESSOR_KEY]) {
    window[PROCESSOR_KEY] = [];
}
