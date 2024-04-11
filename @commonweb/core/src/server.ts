export interface Server {

    setup(target: any): void;

    onInit(): void;

    onUpdate(): void;

}
