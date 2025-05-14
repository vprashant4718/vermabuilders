import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { createListing, deleteListing, getListing, UpdateListing, getSearchListings, getadminlisting, deletePostAdmin} from "../controllers/listing.controller.js";

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.delete('/deletepostadmin/:id', verifyToken, deletePostAdmin);
router.post('/update/:id', verifyToken, UpdateListing);
router.get('/getlisting/:id', getListing);
router.get('/get', getSearchListings);
router.get('/getadminlisting', getadminlisting);

export default router;
