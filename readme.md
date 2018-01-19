#Nodeful

The easy to use library for creating Node.Js REST APIs quickly and efficiently.

# Documentation:

## Installation
```
npm install --save nodeful
```

1. The Nodeful package
2. Using Nodeful Controller
3. Using Nodeful Auth & Auth Middleware

## Controller

1. response - Used to prepare and send a response to the client
2. verifyFields - Used to validate input before going on with the rest of the code
3. Example Usage

### response (Used to prepare a json response)
- this.response(res, code, object)
```
//default object
{
    status: 'fail',
    message: ''
}
//Example usage
this.response(res, 200, {
    status: 'pass',
    message: 'Successfully added user',
    data: ['Thomas', 'Jamie']
})
```

### verifyFields (Used to validate inputs)
- this.verifyFields(array, res, callback)
- accepts an array of inputs with conditions
- accepts a callback
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
//Example usage
//callback is optional, if no callback, provide the res object instead of null. 
//It will automatically throw a 400 response with errors
this.verifyFields([
    { name: 'email', value: 'info@thomascharlesworth.com', conditions: ['required', 'email'] },
], null, (status, errors) => {

})
```

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

## Built in Authorization

### login
- POST
- Fields:
    - email - string
    - password - string, base64
- validates email and password input
- creates a token on successful login (destroys previous token)
```
//Example payload
{
    email: 'thomas.charlesworths@gmail.com',
    password: 'MTIzNDU2'
}
```
### create user
- POST
- Passwords salted and hashed
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

## Middleware

Route conditioning made easy. Use the .use method, provide a method, req, res, db and an array of middlewares for that route.

### auth
```
app.get('/', (req, res) => AuthController.use({ method: 'test', req, res, db, middleware: ['auth']}))
```