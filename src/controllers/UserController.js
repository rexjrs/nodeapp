import Controller from './Controller'

class UserController extends Controller {
    static createUser({ req, res, db }) {
        let email = req.body.email
        let password = req.body.password
        this.verifyFields([
            { name: 'email', value: email, conditions: ['required', 'email'] },
            { name: 'password', value: password, conditions: ['required', 'min-6'] }
        ], (status, errors) => {
            if (!status) {
                res.status(400).json(this.response({
                    errors
                }))
            } else {
                db.query(`INSERT INTO users (email, password) VALUES ('${email}', '${password}')`, (err, result, fields) => {
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
        })
    }
}

export default UserController
