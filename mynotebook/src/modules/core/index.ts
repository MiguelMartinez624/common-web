
export type Observer<T> = (value: T) => void;

export class Observable<T> {
    private subscribers: Observer<T>[] = [];

    subscribe(observer: Observer<T>): void {
        this.subscribers.push(observer);
    }

    notify(value: T): void {
        for (const subscriber of this.subscribers) {
            subscriber(value);
        }
    }
}
