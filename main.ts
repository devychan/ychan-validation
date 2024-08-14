import { isRegExp } from "util/types";
import type { ValidifyTypes } from "./types"
interface StringValidator {
    pattern(regex: RegExp): this;
    minLength(min: number): this;
    maxLength(max: number): this;
    notEmpty(): this;
    required(): this;
    validate(): ValidifyTypes.ResultString | null;
    customMessage(message: ValidifyTypes.CustomMessage | undefined): this;
}
interface NumberValidator {
    number(): this;
    min(min: number): this;
    max(max: number): this;
    required(): this;
    validate(): ValidifyTypes.ResultInteger | null
}
interface ArrayValidator {
    required(): this;
    validate(): ValidifyTypes.ResultInteger | null
}
export class ValidifyString<T> implements StringValidator {
    private text: T;
    private result: ValidifyTypes.ResultString | null = { errors: [] }
    constructor(text: T) {
        this.text = text
    }
    private string(): boolean {
        if (typeof this.text !== "string") {
            const exists = this.result?.errors.some((err) => err.type === "base")
            if (!exists) {
                this.result?.errors.push({
                    type: "base",
                    name: "StringTypeReference",
                    message: `value must be a string`
                })
            }
            return false
        }
        return true
    }
    /**
     * @readonly
     * 
     * Use to set the minimum length of characters in string
     * @param min number
     */
    minLength(min: number): this {
        if (!this.string()) {
            return this
        }
        const text = this.text as string
        const textLength = text.replace(/\s/g, "").length
        if (textLength < min) {
            this.result?.errors.push({
                type: "min",
                name: "StringLengthReference",
                message: `value must be at least ${min}`
            })
        }
        return this
    }
    /**
     * @readonly
     * 
     * Use to set the maximum length of characters in string
     * @param max number
     */
    maxLength(max: number): this {
        if (!this.string()) {
            return this
        }
        const text = this.text as string
        const textLength = text.replace(/\s/g, "").length
        if (textLength > max) {
            this.result?.errors.push({
                type: "max",
                name: "StringLengthReference",
                message: `value must not be > ${max}`
            })
        }
        return this
    }
    /**
     * @readonly
     * Use to check empty string
     * 
     */
    notEmpty(): this {
        if (!this.string()) {
            return this
        }
        const text = this.text as string
        const base = text.replace(/\s/g, "") as string
        if (base === "") {
            this.result?.errors.push({
                type: "empty",
                name: "StringEmptyReference",
                message: "value can't be empty"
            })
        }
        return this
    }
    /**
     * Use to set a custom format of string
     * @param regex number
     */
    pattern(regex: RegExp): this {
        if (!this.string()) {
            return this
        }
        const isValid = isRegExp(regex)
        if (!isValid) {
            this.result?.errors.push({
                type: "pattern",
                name: "RegExpPatternReference",
                message: "regex is invalid"
            })
            return this
        }
        const text = this.text as string
        if (!regex.test(text)) {
            this.result?.errors.push({
                type: "pattern",
                name: "StringPatternReference",
                message: "value is incorrect format"
            })
            return this
        }
        return this
    }
    /**
     * @readonly
     * 
     * Use to specify the data is required
     * check the null and undefined values
     * @example
     * ```javascript
     * const validate = new ValidifyString("Hello, world")
     * const result = validate.required()
     * console.log(result)
     * ```
     * @result
     * @passed return null
     * @error return error object
     */
    required(): this {
        if (!this.string()) {
            return this
        }
        const text = this.text
        if (!text) {
            this.result?.errors.push({
                type: "required",
                name: "StringRequiredReference",
                message: "value is required"
            })
        }
        return this
    }
    /**
     * 
     * @param customMessage
     * Use to customize error messages
     * @example
     * ```javascript
     * customMessage = {
     *   "base" : "text must be a valid string",
     *   "min" : "text must be at least min of 5"
     * }
     * ```
     * @property supported with these values
     * 
     * base | min | max | empty | pattern | required 
     */
    customMessage(customMessage: ValidifyTypes.CustomMessage | undefined): this {
        if (customMessage) {
            Object.entries(customMessage).map(([key, value]) => {
                const validKeys: ValidifyTypes.HelperString[] = ['empty', 'min', 'max', 'required']
                if (validKeys.includes(key as ValidifyTypes.HelperString)) {
                    const error = this.result?.errors.find((err) => err.type === key)
                    if (!error) {
                        return this
                    }
                    const filtered = this.result?.errors.filter((err) => err.type !== key)
                    filtered?.push({ ...error, message: value })
                    this.result = {
                        errors: filtered ?? [{ ...error, message: value }]
                    }
                }
            })
        }
        return this
    }
    /**
     * @readonly
     * 
     * @returns null
     * @returns error
     */
    validate(): ValidifyTypes.ResultString | null {
        this.string()
        if (this.result!.errors.length > 0) {
            return this.result
        }
        return this.result
    }
}
export class ValidifyNumber<T> implements NumberValidator {
    private num: T;
    private result: ValidifyTypes.ResultInteger | null = { errors: [] }
    constructor(number: T) {
        this.num = number
    }
    private isNumber(): boolean {
        const number = this.num
        if (typeof number !== "number") {
            return false
        }
        return true
    }
    number(): this {
        if (!this.isNumber()) {
            this.result?.errors.push({
                type: "base",
                name: "NumberTypeReference",
                message: `value must be a number`
            })
            return this
        }
        return this
    }
    min(min: number): this {
        if (!this.isNumber()) {
            return this
        }
        const number = +this.num
        if (min < number) {
            this.result?.errors.push({
                type: "min",
                name: "NumberMinReference",
                message: `value must be at least ${min}`,
            })
            return this
        }
        return this
    }
    max(max: number): this {
        if (!this.isNumber()) {
            return this
        }
        const number = +this.num
        if (number > max) {
            this.result?.errors.push({
                type: "max",
                name: "NumberMinReference",
                message: `value must be > to ${max}`,
            })
            return this
        }
        return this
    }
    required(): this {
        const number = this.num
        if (!number) {
            this.result?.errors.push({
                type: "required",
                name: "NumberRequiredReference",
                message: "value is required"
            })
            return this
        }
        return this
    }
    validate(): ValidifyTypes.ResultInteger | null {
        if (this.result!.errors.length > 0) {
            return this.result
        }
        return null
    }
}
const validate = new ValidifyNumber(new Object({ dsa: "sd" }));
const result = validate.number().min(234).required().validate()
console.log(result?.errors)