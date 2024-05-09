export enum TaskState {
    Pending,
    InProgress,
    Completed
}

export class TaskItem {
    constructor(
        public  id: string,
        public  title: string,
        public  description: string,
        public  state: TaskState,
        public  comments: TaskComment[]) {
    }

}

export class TaskComment {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly creationDate: Date) {
    }
}
