export namespace ValidifyTypes {
    export type HelperString = 'base' | 'min' | 'max' | 'empty' | 'pattern' | 'required'
    export type HelperNumber = 'base' | 'integer' | 'decimal' | 'min' | 'max' | 'required'
    export interface Option {
        once?: boolean
    }
    export interface ResultString {
        errors: {
            field?: string,
            type: HelperString;
            name: string,
            message: string
        }[]
    }
    export interface ResultInteger {
        errors: {
            field?: string,
            type: HelperNumber;
            name: string,
            message: string
        }[]
    }
    export interface CustomMessage {
        [key: string]: string
    }
}