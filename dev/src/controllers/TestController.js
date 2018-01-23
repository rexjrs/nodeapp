import Controller from './Controller'

class TestController extends Controller {
    static eloq({ req, res, db }) {
        this.query(db, `users::where(id > 10)->where(fullname, 'Jamie Charlesworth')->get()`, (status, result) => {
            this.response(res, 200, {
                status: 'pass',
                message: 'Done',
                data: result
            })
        })

    }
}

export default TestController
