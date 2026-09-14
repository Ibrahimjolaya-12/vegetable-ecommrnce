import express from "express";
import { Auth, isAdminAuth } from "../Middlewares/Auth.middleware.js";
import { 
  cancelOrder,
  createOrder, 
  getAllOrders, 
  getMyOrders, 
  removeOrderItem, 
  updateOrderStatus 
} from "../Controllers/Order.controller.js";

const router = express.Router();

// 1. Customer places order
router.post("/", Auth, createOrder);

// 2. Customer views their own orders
router.get("/my-orders", Auth, getMyOrders);

// 3. Admin views ALL orders from all customers
router.get("/", Auth, isAdminAuth, getAllOrders);

// 4. Admin updates order status (e.g. pending -> delivered)
router.put("/:id/status", Auth, isAdminAuth, updateOrderStatus);

router.patch("/:id/cancel", Auth, cancelOrder);

router.delete("/:orderId/item/:itemId", Auth, removeOrderItem);

export default router;