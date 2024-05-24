export enum TaskState {
    Pending,
    InProgress,
    Completed
}


export class User {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly lastname: string,
        public readonly avatar: string,
    ) {
    }
}

// need to attah this to a uwner
export class TaskItem {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public parentId: string | null,
        public user: User | null,
        public state: TaskState,
        public comments: TaskComment[],
    ) {
    }

}

export class TaskComment {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public user: User,
        public readonly creationDate: Date) {
    }
}
