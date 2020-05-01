import * as express from 'express';

import { signUp, login, logout, terminateUserAccount } from '../controllers/firebaseAuth'


const router = express.Router();

router.post('/auth/register', signUp);
router.post('/auth', login);
router.get('/auth', logout);
router.delete('/auth/:userId', terminateUserAccount);

export default router;