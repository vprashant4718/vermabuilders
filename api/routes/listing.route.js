import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { createListing, deleteListing, getListing, UpdateListing, getSearchListings} from "../controllers/listing.controller.js";

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, UpdateListing);
router.get('/getlisting/:id', getListing);
router.get('/get', getSearchListings);

export default router;

