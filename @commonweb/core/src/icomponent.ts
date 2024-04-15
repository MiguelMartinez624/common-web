export interface IComponent {

    setup(target: any): void;

    onInit(): void;

    onUpdate(): void;

}
