import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { createListing, deleteListing, getListing, UpdateListing, getSearchListings, getadminlisting, deletePostAdmin} from "../controllers/listing.controller.js";

const router = express.Router();

// listing operations
// create listing
router.post('/create', verifyToken, createListing);
// update listing
router.post('/update/:id', verifyToken, UpdateListing);

// user operations 
router.get('/getlisting/:id', getListing);
router.delete('/delete/:id', verifyToken, deleteListing);

// getting search listings
router.get('/get', getSearchListings);

// admin operations
router.get('/getadminlisting', getadminlisting);
router.delete('/deletepostadmin/:postId', verifyToken, deletePostAdmin);

export default router;

