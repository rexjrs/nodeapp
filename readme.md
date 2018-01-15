# Documentation:

## Class Controller

### response (Used to prepare a json response)
- this.response(object)
- accepts object
- can overide status, message and add extra fields
```
//Returns an object
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
- Supported conditions: 'required', 'email', 'min-0', 'max-0'
```
//Example usage
this.verifyFields([
{ name: 'email', value: 'info@thomascharlesworth.com', conditions: ['required', 'email'] },
], (status, errors) => {

})
```