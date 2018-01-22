import DefaultController from './controllers/Controller'
import AuthController from './controllers/AuthController'
import TestingController from './controllers/TestController'
import { authMiddleware } from './middleware/Middleware'

const Nodeful = {
    Controller: Controller,
    TestController: TestController,
    Auth: {
        controller: AuthController,
        middleware: authMiddleware
    }
}

export const Auth = {
    controller: AuthController,
    middleware: authMiddleware
}
export const Controller = DefaultController

export const TestController = TestingController

export default Nodeful
