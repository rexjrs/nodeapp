export default class Controller {
    static response(res, code, message) {
        return res.status(code).json({
            status: 'fail',
            message: '',
            ...message
        })
    }

    static verifyFields(inputs, res, callback) {
        const isFloat = (n) => {
            return n === +n && n !== (n | 0);
        }
        const isInteger = (n) => {
            return n === +n && n === (n | 0);
        }
        const validateEmail = (email) => {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email.toLowerCase());
        }
        const errors = []
        inputs.forEach((value, index) => {
            let err = []
            for (let condition in value.conditions) {
                if (value.value === null || value.value === undefined) {
                    err = []
                    err.push('value is required')
                } else {
                    if (err[0] === 'value is required') { return false }
                    switch (value.conditions[condition]) {
                        case 'email':
                            if (!validateEmail(value.value)) {
                                err.push('value is not a valid email address')
                            }
                            break;
                        case 'string':
                            if (typeof value.value == 'string' || value.value instanceof String) { } else {
                                err.push('value is not a string')
                            }
                            break;
                        case 'number':
                            if (isInteger(value.value) || isFloat(value.value)) { } else {
                                err.push('value is not a number')
                            }
                            break;
                        case 'boolean':
                            if (typeof value.value == 'boolean' || value.value instanceof Boolean) { } else {
                                err.push('value is not a boolean')
                            }
                            break;
                        default:
                            break;
                    }
                    if (value.conditions[condition].substring(0, 3) === 'min') {
                        let length = parseInt(value.conditions[condition].substring(4), 10)
                        if (value.value.length < length) {
                            err.push(`minimum length required ${length}`)
                        }
                    }
                    if (value.conditions[condition].substring(0, 3) === 'max') {
                        let length = parseInt(value.conditions[condition].substring(4), 10)
                        if (value.value.length > length) {
                            err.push(`maxinum length ${length}`)
                        }
                    }
                }
            }
            if (err.length > 0) {
                errors.push({
                    name: value.name,
                    errors: err
                })
            }
        })
        if (errors.length > 0) {
            if (callback) {
                callback(false, errors)
            } else {
                throw this.response(res, 400, {
                    errors
                })
            }
        } else {
            if (callback) {
                callback(true)
            }
        }
    }
}