#Documentation:

##Class Controller
    ###Built in functions:
        response (Used to prepare a json response)
        verifyFields (Used to validate inputs)

    - this.response(object)
        accepts object
        returns obj:
            ```
            {
                status: 'fail',
                message: ''
            }
            ```
        can overide status, message and add extra fields
        Example: 
            ```
            res.status(200).json(this.response({
                status: 'pass',
                message: 'Successfully added user',
                data: ['Thomas', 'Jamie']
            }))
            ```

    - this.verifyFields(array, callback)
        accepts an array of inputs with conditions
        accepts a callback
        returns a status of boolean
        returns array of errors if any
        Supported conditions: 'required', 'email', 'min-0', 'max-0'
        Example: 
            ```
            this.verifyFields([
                { name: 'email', value: 'info@thomascharlesworth.com', conditions: ['required', 'email'] },
            ], (status, errors) => {

            })
            ```