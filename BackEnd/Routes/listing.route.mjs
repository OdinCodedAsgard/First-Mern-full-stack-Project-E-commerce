import express from 'express';
import { getListing, createlisting, deleteListing, updateListing,getAllListings} from '../Controllers/listingcontoller.mjs';
import { verifyToken } from '../Utils/verifyUser.mjs';

const router = express.Router();

router.post('/api/create',verifyToken,createlisting);
router.delete('/api/deleteListing/:id',verifyToken,deleteListing);
router.post('/api/updateListing/:id',verifyToken, updateListing);
router.get('/api/getAllListings',getAllListings);
router.get('/api/getListing/:id', getListing);

export default router;