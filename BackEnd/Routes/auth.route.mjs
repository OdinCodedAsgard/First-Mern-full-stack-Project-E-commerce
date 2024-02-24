import express from 'express';
import { authHandler, signIn ,GoogleSignIn} from '../Controllers/authHandler.mjs';

const router = express.Router();
router.post('/api/signup',authHandler);
router.post('/api/signin',signIn);
router.post('/api/auth/google',GoogleSignIn);


export default router;