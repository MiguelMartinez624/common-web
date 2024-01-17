/*
* LocalStorageBind link a value from the storage and linked to the element
* this will by default update the value each time the value change on the storage
* **/
import {extractData} from "../html_manipulation";
import {isJSON} from "../web_components";

export class LocalStorageBind {
    private readonly key: string;
    private readonly elementProperty: string;
    private propertyPath: string;

    constructor(public readonly rawString: string) {
        const value = rawString.replace("storage://", "");
        const sections = value.split(":");
        // TODO: need toi validate the length of this strings to avoid out of index errors
        this.key = sections[0];
        this.propertyPath = value.replace(this.key, "");
    }


    public get value(): any {
        const value = localStorage.getItem(this.key);
        if (isJSON(value)) {
            const obj = JSON.parse(value);
            return extractData(this.propertyPath, obj);
        }

        return value;
    }

    public onChange(cb: (newValue: any) => void): void {
        throw "No implemented onChange yet."
    }


}