export default class Controller {
    static response(message) {
        return {
            status: 'fail',
            message: '',
            ...message
        }
    }

    static verifyFields(inputs, callback) {
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
                                err.push('not a valid email address')
                            }
                            break;
                        default:
                            break;
                    }
                    if(value.conditions[condition].substring(0,3) === 'min'){
                        let length = parseInt(value.conditions[condition].substring(4), 10)
                        if(value.value.length < length){
                            err.push(`minimum length required ${length}`)
                        }
                    }
                    if(value.conditions[condition].substring(0,3) === 'max'){
                        let length = parseInt(value.conditions[condition].substring(4), 10)
                        if(value.value.length > length){
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
            callback(false, errors)
        } else {
            callback(true)
        }
    }
}