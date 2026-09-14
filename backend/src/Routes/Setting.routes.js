import express from "express";
import { Auth, isAdminAuth } from "../Middlewares/Auth.middleware.js";
import { getDeliveryFee, updateDeliveryFee } from "../Controllers/Settings.controller.js";

const router = express.Router();

router.get("/delivery-fee", getDeliveryFee);
router.post("/delivery-fee", Auth, isAdminAuth, updateDeliveryFee);

export default router;