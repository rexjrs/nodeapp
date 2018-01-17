# Documentation:

## Pre-Requisites
1. Install latest version of Node
2. npm install -g nodemon

## Installation
1. git clone https://github.com/rexjrs/nodeapp.git
2. cd nodeapp
3. npm install
4. nodemon Index.js

## Class Controller's built in helpers

### response (Used to prepare a json response)
- this.response(object)
- accepts object
- can overide status, message and add extra fields
```
//Returns a default object
{
    status: 'fail',
    message: ''
}
//Example usage
res.status(200).json(this.response({
    status: 'pass',
    message: 'Successfully added user',
    data: ['Thomas', 'Jamie']
}))
```

### verifyFields (Used to validate inputs)
- this.verifyFields(array, callback)
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
this.verifyFields([
    { name: 'email', value: 'info@thomascharlesworth.com', conditions: ['required', 'email'] },
], (status, errors) => {

})
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
- Fields:
    - fullname - string
    - email - string
    - password - string
```
//Example payload
{
    fullname: 'Thomas Charlesworth',
    email: 'thomas.charlesworths@gmail.com',
    password: 'MTIzNDU2'
}
```