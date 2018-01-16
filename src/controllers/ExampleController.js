import Controller from './Controller'

class ExampleController extends Controller {
    static testValidate({ req, res }) {
        let input = req.body.input
        this.verifyFields([
            { name: 'input', value: input, conditions: ['required', 'boolean'] }
        ], (status, errors) => {
            if (!status) {
                res.status(400).json(this.response({
                    errors
                }))
            } else {
                res.status(200).json(this.response({
                    status: 'pass',
                    message: 'nice'
                }))
            }
        })
    }

    static loginUser({ req, res, db }) {

    }

    static createUser({ req, res, db }) {
        let fullname = req.body.fullname
        let email = req.body.email
        let password = req.body.password
        let continueDB = false
        this.verifyFields([
            { name: 'fullname', value: email, conditions: ['required', 'string'] },
            { name: 'email', value: email, conditions: ['required', 'email'] },
            { name: 'password', value: password, conditions: ['required', 'string', 'min-6'] }
        ], (status, errors) => {
            if (!status) {
                res.status(400).json(this.response({
                    errors
                }))
            } else {
                continueDB = true
            }
        })
        if (continueDB) {
            db.query(`INSERT INTO users (email, password, fullname) VALUES ('${email}', '${password}', '${fullname}')`, (err, result, fields) => {
                if (err) {
                    res.status(500).json(this.response({
                        message: 'Error inserting user into Database'
                    }))
                } else {
                    res.status(201).json(this.response({
                        status: 'pass',
                        message: 'User successfully created'
                    }))
                }
            })
        }
    }
}

export default ExampleController
