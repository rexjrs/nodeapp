import Controller from './Controller'

class TestController extends Controller {
    static eloq({ req, res, db }) {
        this.query(db, `users::get()`, (err, result) => {
            this.response(res, 200, {
                status: 'pass',
                message: 'Done',
                data: result
            })
        })

    }
}

export default TestController
