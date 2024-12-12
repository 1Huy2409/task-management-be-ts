import { Router } from 'express';
const router: Router = Router();
import * as controller from "../controller/user.controller";
import requestAuth from '../middlewares/auth.middleware';
router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/detail',
    requestAuth, 
    controller.detail);

export const userRoutes: Router = router;