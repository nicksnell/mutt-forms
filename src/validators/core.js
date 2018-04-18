/**
* @file Core Validators
*/

/**
* Base Validation Interface
* @class
*/
export class Validator {
    /**
     * Initalise a new validator
     * @param {object} [messages] - Object of {error: messages}
     * @constructor
     */
    constructor(messages = {}) {
        this.error = null
        this.messages = {
            required: 'This field is required.',
        }

        Object.assign(this.messages, messages)
    }

    /**
     * Default API for child classes to extend
     * @param {*} value - Value to validate
     * @return {boolean} Return field validation status
     */
    validate(value) {
        return true
    }
}

/**
* RequiredValidator - Validate the existance of a value
* @class
*/
export class RequiredValidator extends Validator {
    /**
     * Check if a value exists
     * @param {*} value - Value to validate
     * @return {boolean} Return field validation status
     */
    validate(value) {
        if (!value && (value !== 0)) {
            this.error = this.messages.required
            return false
        }

        return true
    }
}

/**
* BooleanRequiredValidator - Validate the existance of a value
* @class
*/
export class BooleanRequiredValidator extends Validator {
    /**
     * Check if a value exists as a boolean, this can
     * be True or False but not null
     * @param {*} value - Value to validate
     * @return {boolean} Return field validation status
     */
    validate(value) {
        if (!(value === true || value === false)) {
            this.error = this.messages.required
            return false
        }

        return true
    }
}

/**
* BooleanTrueValidator - Validate the existance of a true value
* @class
*/
export class BooleanTrueValidator extends Validator {
    /**
     * Check if a value exists as a boolean and is true.
     * @param {*} value - Value to validate
     * @return {boolean} Return field validation status
     */
    validate(value) {
        if (value !== true) {
            this.error = this.messages.required
            return false
        }

        return true
    }
}

/**
* LengthValidator - Validate the length of a value
* @class
*/
export class LengthValidator extends Validator {
    /**
     * Extend the base validator to accept min/max
     * arguments to the constructoe
     * @param {integer} [min] - Minimum Length
     * @param {integer} [max] - Maximum Length
     * @param {object} [messages] - Extend error messages
     * @constructor
     */
    constructor({min = null, max = null, messages = null}) {
        super(messages)

        this.min = min
        this.max = max

        if (!this.messages.hasOwnProperty('minLength')) {
            this.messages.minLength = `Length must be at least ${this.min}!`
        }

        if (!this.messages.hasOwnProperty('maxLength')) {
            this.messages.maxLength = `Length must be no more than ${this.max}!`
        }
    }

    /**
     * Validate a value
     * @param {string|array} value - Value to validate
     * @return {boolean} Return field validation status
     */
    validate(value) {
        if (!value) {
            this.error = this.messages.required
            return false
        }

        if (this.min && value.length < this.min) {
            this.error = this.messages.minLength
            return false
        }

        if (this.max && value.length > this.max) {
            this.error = this.messages.maxLength
            return false
        }

        return true
    }
}

/**
* IntegerValidator - Validate the integer is of a correct type
* @class
*/
export class IntegerValidator extends Validator {
    /**
     * @param {object} [messages] - Extend error messages
     * @constructor
     */
    constructor(messages = {}) {
        super(messages)

        if (!this.messages.hasOwnProperty('intRequired')) {
            this.messages.intRequired = `Value must be an integer`
        }
    }

    /**
     * Validate a value
     * @param {*} value - Value to validate
     * @return {boolean} Return field validation status
     */
    validate(value) {
        // NOTE: We only check it's an integer IF we
        // have a value.
        if (value && isNaN(value)) {
            this.error = this.messages.intRequired
            return false
        }

        return true
    }
}

/**
* RegexValidator - Validate the value against a regular expression
* @class
*/
export class RegexValidator extends Validator {
    /**
     * @param {string} pattern - Regular expression to validate against
     * @param {object} [messages] - Extend error messages
     * @constructor
     */
    constructor(pattern, messages = {}) {
        super(messages)

        this.pattern = pattern

        if (!this.messages.hasOwnProperty('invalidPattern')) {
            let msg = `Value must match the pattern: ${this.pattern}`
            this.messages.invalidPattern = msg
        }
    }

    /**
     * Validate a value
     * @param {*} value - Value to validate
     * @return {boolean} Return field validation status
     */
    validate(value) {
        if (!value) {
            this.error = this.messages.required
            return false
        }

        if (!value.match(this.pattern)) {
            this.error = this.messages.invalidPattern
            return false
        }

        return true
    }
}
