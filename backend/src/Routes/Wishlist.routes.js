import express from "express";
import { Auth } from "../Middlewares/Auth.middleware.js";
import { getWishlist, toggleWishlist } from "../Controllers/Wishlist.controller.js";

const router = express.Router();

router.post("/toggle",Auth, toggleWishlist)
router.get("/", Auth, getWishlist)

export default router;