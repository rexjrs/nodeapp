export default class Controller {
    static response(message) {
        return {
            status: '',
            message: '',
            ...message
        }
    }

    static isRequired(inputs){
        let status = true
        for(let i in inputs){
            if(inputs[i] === '' || inputs[i] === undefined || inputs[i] === null){
                status = false
            }
        }
        return status
    }
}