import {attachRouteListeners} from "./decorators";

export * from './route';
export * from './router';
export * from './decorators';


if (window && window['_webcommon_components_processors']) {
    window['_webcommon_components_processors'].push(attachRouteListeners);
}
