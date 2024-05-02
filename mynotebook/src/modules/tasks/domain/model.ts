export enum TaskState {
    Pending,
    InProgress,
    Completed
}

export class TaskItem {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly description: string,
        public readonly state: TaskState,
        public readonly comments: TaskComment[]) {
    }

}

export class TaskComment {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly creationDate: Date) {
    }
}
