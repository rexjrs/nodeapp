export default class Controller {
    static query(db, query, callback) {
        let finalQuery = ''
        const tableName = query.slice(0, query.indexOf('::'))
        let fullQuery = query.slice(query.indexOf('::') + 2)
        let nextString = ''
        let finalMove = ''
        const conditions = []
        const seperate = () => {
            if (fullQuery.indexOf('->') > -1) {
                let workOn = fullQuery.slice(0, fullQuery.indexOf('->'))
                let workOnArray = workOn.split(',')
                if (workOnArray.length < 3) {
                    let type = workOnArray[0].slice(0, workOnArray[0].indexOf('('))
                    let parameter = (workOnArray[0].slice(workOnArray[0].indexOf('(') + 1)).trim()
                    let value = workOnArray[1].replace(`)`, '').trim()
                    conditions.push(`${type.toUpperCase()} ${parameter} = ${value}`)
                }
                nextString = fullQuery.slice(fullQuery.indexOf('->') + 2)
                if (nextString.indexOf('->') < 0) {
                    prepStatement()
                } else {
                    seperate()
                }
            }else{
                nextString = fullQuery
                prepStatement()
            }
        }
        const prepStatement = () => {
            if (nextString.indexOf('get') > -1 || nextString.indexOf('first') > -1) {
                finalQuery = `SELECT * FROM ${tableName} `
            }
            if (nextString.indexOf('pluck') > -1) {
                let params = nextString.replace('pluck(', '').replace(')', '').split(',')
                let paramString = ''
                params.forEach((value, index) => {
                    if (index + 1 === params.length) {
                        paramString = `${paramString} ${value.trim()} `
                    } else {
                        paramString = `${paramString} ${value.trim()}, `
                    }
                })
                finalQuery = `SELECT ${paramString.trim()} FROM ${tableName} `
            }
        }
        seperate()
        conditions.forEach((value, index) => {
            finalQuery = finalQuery + value
        })
        db.query(finalQuery, (err, result) => {
            if (!err) {
                if (query.indexOf('first') > -1) {
                    callback(true, result[0])
                } else {
                    callback(true, result)
                }
            } else {
                callback(false, err)
            }
        })
    }

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