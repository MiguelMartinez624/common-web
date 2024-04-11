import {InterpolationServer} from "./server";

export * from './attribute-interpolation';
export * from './template-interpolation';


export interface Interpolation {
    update()
}


export function TemplateScanner(): ClassDecorator {
    return (target: any) => {
        appendInterpolationServer(target)
        return target;
    };
}

export function appendInterpolationServer(target: any) {
    if (target.servers === undefined) {
        target.servers = [new InterpolationServer()];
    } else {
        target.servers.push(new InterpolationServer());
    }
}
