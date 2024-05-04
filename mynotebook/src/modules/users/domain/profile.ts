export type ProfileID = string;
export type CalendarDate = string;

export class Profile {
    constructor(
        public readonly id: ProfileID,
        public readonly avatarURL: string,
        public readonly name: string,
        public readonly lastname: string,
        public birthDate: CalendarDate
    ) {
    }
}
