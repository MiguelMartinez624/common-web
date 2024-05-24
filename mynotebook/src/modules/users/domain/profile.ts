export type ProfileID = string;
export type CalendarDate = string;

// Profile guard profiles behind aacount, check how to make
// implementations with google/facebook and major authentication providers.
export class Profile {
    constructor(
        public readonly id: ProfileID,
        public readonly avatarURL: string,
        public readonly name: string,
        public readonly lastname: string,
        public birthDate: CalendarDate,
        public contactInfo: ContactInfo
    ) {
    }
}

export class ContactInfo {
    constructor(
        public readonly phoneNumber: string,
        public readonly phoneCode: string,
        public readonly email: string,
    ) {
    }
}

