
export * from './attribute-interpolation';
export * from './template-interpolation';


export interface Interpolation {
    update()
}
export function TemplateScanner(): ClassDecorator {
    return (target: any) => {
        // Agregar los métodos a la clase
        target.prototype.scanTemplateForInterpolation = function (template: string) {
            // Implementar la lógica de escaneo
            // ...
        };

        target.prototype.evaluateInterpolations = function (
            template: string,
            data: any
        ) {
            // Implementar la lógica de evaluación
            // ...
        };

        target.prototype.getInterpolationPositions = function () {
            // Implementar la lógica de extracción de posiciones
            // ...
        };


        return target;
    };
}Al
