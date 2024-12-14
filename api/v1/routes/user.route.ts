import { Router } from 'express';
const router: Router = Router();
import * as controller from "../controller/user.controller";
import requestAuth from '../middlewares/auth.middleware';
// [POST] /api/v1/register
router.post('/register', controller.register);
// [POST] /api/v1/login
router.post('/login', controller.login);
// [GET] /api/v1/detail
router.get('/detail',
    requestAuth, 
    controller.detail);

export const userRoutes: Router = router;