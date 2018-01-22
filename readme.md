# Nodeful

The easy to use library for creating Node.Js REST APIs quickly and efficiently.

Created by Thomas Charlesworth.

# Documentation:

## Installation
```
npm install --save nodeful
```

1. Using Nodeful Controller
3. Using Nodeful Auth & Auth Middleware

## Controller

1. Example usage of Controller class
2. verifyFields - Used to validate input before going on with the rest of the code
3. response - Used to prepare and send a response to the client
4. Eloquent Querying - Easier querying

### Example usage
```
import Nodeful, { Controller } from 'nodeful'

export default class BasicController extends Controller{
    static basicFunction({req, res}){
        const email = req.body.email
        this.verifyFields([
            { name: 'email', value: email, conditions: ['required', 'email'] }
        ], res)
        return this.response(res, 200, {
            status: 'pass',
            message: `Hello there ${email}`
        })
    }
}
```

### response (Used to prepare and send a json response)
- this.response(res, code, object)
```
//default object
{
    status: 'fail',
    message: ''
}
this.response(res, 200, {
    status: 'pass',
    message: 'Successfully added user',
    data: ['Thomas', 'Jamie']
})
```

### verifyFields (Used to validate inputs)
- returns a status of boolean
- returns array of errors if any
- Supported conditions: 
    - 'required'
    - 'email'
    - 'min-0' 
    - 'max-0'
    - 'string'
    - 'number'
    - 'boolean'
```
this.verifyFields([
    { name: 'email', value: 'info@thomascharlesworth.com', conditions: ['required', 'email'] },
], null, (status, errors) => {

})
// No Callback use (Automatically throws status 400 with errors)
this.verifyFields([
    { name: 'email', value: 'info@thomascharlesworth.com', conditions: ['required', 'email'] },
], res)
```

### Eloquent Querying
- Supported DBs:
    - MySQL
- Supported Statements:
```
const query = `users::get()`
const query = `users::first()`
const query = `users::pluck(email, fullname)`
const query = `users::where(fullname, 'Thomas Charlesworth')->get()`
const query = `users::where(fullname, 'Thomas Charlesworth')->first()`
const query = `users::where(fullname, 'Thomas Charlesworth')->pluck(email, fullname)`

this.query(db, query, (err, result) => { 
    console.log(result, err)
})
```

## Built in Auth and Auth Middleware (Requires a MySQL database and Default Tables)

1. Example usage
2. Login
3. Create User
4. Auth Middleware

### Example usage
```
import Nodeful, { Auth } from 'nodeful'

const routes = ({ app, db }) => {
    app.post('/createuser', (req, res) => Auth.controller.createUser({ req, res, db }))
    app.post('/login', (req, res) => Auth.controller.loginUser({ req, res, db }))
}

export default routes
```

### Login
On successful login, creates token and destroys previous token. Returns user details with token.
- POST
- Fields:
    - email - string
    - password - string, base64
```
//Example payload
{
    email: 'thomas.charlesworths@gmail.com',
    password: 'MTIzNDU2'
}
```
### Create User
Creates a new account, salts and hashes the password.
- POST
- Fields:
    - fullname - string
    - email - string
    - password - string, base64
```
//Example payload
{
    fullname: 'Thomas Charlesworth',
    email: 'thomas.charlesworths@gmail.com',
    password: 'MTIzNDU2'
}
```

### Auth Middleware
If you protect a route with the AuthMiddleware, you must send the following headers:
```
const headers = {
    Authorization: 'Bearer 83ec208d96bb73a9e11dd784db0e9ddde03be3d1',
    uid: 2
}
```
#### Example Usage
Just place Auth.middleware({db}) as the second parameter.
```
import Nodeful, { Auth } from 'nodeful'

const routes = ({ app, db }) => {
    app.get('/getprofile', Auth.middleware({db}), (req,res) => {
        if(!req.body.uid){
            return res.status(400).json({
                status: 'fail',
                message: 'Missing uid parameter'
            })
        }else{
            db.query(`SELECT * FROM users WHERE id = '${req.body.uid}'`, (err, result) => {
                if(err){
                    return res.status(400).json({
                        status: 'fail',
                        message: 'Internal server error.'
                    })
                }else{
                    return res.status(200).json({
                        status: 'pass',
                        data: result[0]
                    }) 
                }
            })
        }
    })
}

export default routes
```

nodeful is freely distributable under the terms of the [MIT license](./license.txt).