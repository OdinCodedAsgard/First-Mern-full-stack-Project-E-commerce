import express from 'express';
import { userRouteHandler } from '../Controllers/UserRoute.mjs';
import { verifyToken } from '../Utils/verifyUser.mjs';
import {updateUserController} from  "../Controllers/UserRoute.mjs";
import { deleteUserController } from '../Controllers/UserRoute.mjs';
import { signout } from '../Controllers/UserRoute.mjs';
import { getUserListings,getUserInfo } from '../Controllers/UserRoute.mjs';
const router = express.Router();

router.get('/',userRouteHandler);
router.post('/api/update/:id', verifyToken,updateUserController);
router.delete('/api/delete/:id', verifyToken,deleteUserController);
router.get('/api/signout',signout);
router.get('/api/listing/:id',verifyToken,getUserListings)
router.get('/:id',verifyToken, getUserInfo)
export default router;