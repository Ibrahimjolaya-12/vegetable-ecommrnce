import express from "express";
import { Auth, isAdminAuth } from "../Middlewares/Auth.middleware.js";
import { addVegetable, deleteVegetable, getAllVegetables, getSingleVegetable, updateVegetable } from "../Controllers/Product.controller.js";
import upload from "../Middlewares/Multer.middleware.js";

const router = express.Router();

router.post("/", Auth, isAdminAuth,upload.single("product"), addVegetable );
router.get("/", getAllVegetables)
router.get("/:id", getSingleVegetable)
router.put("/:id", Auth, isAdminAuth, updateVegetable);
router.delete("/:id", Auth, isAdminAuth, deleteVegetable)

export default router;