import {PROCESSOR_KEY} from "./components";

export * from './field_decorators';
export * from './components';
export * from './html_manipulation';
export * from './storage';
export * from './events';
export * from './attributes';

// if there are not any processor yet start the empty array;
if (!window[PROCESSOR_KEY]) {
    window[PROCESSOR_KEY] = [];
}
