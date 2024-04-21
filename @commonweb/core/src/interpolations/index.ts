import {InterpolationComponent} from "./component";

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
        target.servers = [new InterpolationComponent()];
    } else {
        target.servers.push(new InterpolationComponent());
    }
}
