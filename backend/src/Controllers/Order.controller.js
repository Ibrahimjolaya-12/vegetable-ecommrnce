// // import Order from "../Models/Order.model.js";
// // import Product from "../Models/Vegetable.model.js";

// // // 1. Create New Order (Stock deduction + Dynamic Delivery Fee verified)
// // export const createOrder = async (req, res) => {
// //   try {
// //     const { orderItems, deliveryAddress, paymentMethod, deliveryFee } = req.body;

// //     if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
// //       return res.status(400).json({ success: false, message: "Cart items are required" });
// //     }

// //     if (!deliveryAddress?.address || !deliveryAddress?.phone) {
// //       return res.status(400).json({ success: false, message: "Delivery address and phone are required" });
// //     }

// //     const userId = req.user?.id || req.user?._id || req.user?.userId;
// //     if (!userId) {
// //       return res.status(401).json({ success: false, message: "Unauthorized, user missing" });
// //     }

// //     let calculatedProduceTotal = 0;
// //     const verifiedOrderItems = [];
// //     const productsToUpdate = [];

// //     // Phase 1: Stock & Price Verification
// //     for (const item of orderItems) {
// //       if (!item.quantity || item.quantity <= 0) {
// //         return res.status(400).json({ success: false, message: "Invalid quantity provided" });
// //       }

// //       const product = await Product.findById(item.product);

// //       if (!product) {
// //         return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
// //       }

// //       if (!product.isAvailable || product.stockQuantity < item.quantity) {
// //         return res.status(400).json({
// //           success: false,
// //           message: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`
// //         });
// //       }

// //       calculatedProduceTotal += product.price * item.quantity;

// //       verifiedOrderItems.push({
// //         product: product._id,
// //         name: product.name,
// //         urduName: product.urduName,
// //         imageURL: product.imageURL,
// //         quantity: item.quantity,
// //         unit: product.unit,
// //         price: product.price
// //       });

// //       product.stockQuantity -= item.quantity;
// //       if (product.stockQuantity === 0) {
// //         product.isAvailable = false;
// //       }
// //       productsToUpdate.push(product);
// //     }

// //     // Phase 2: Add Delivery Fee to Final Total
// //     const appliedFee = Number(deliveryFee || 0);
// //     const finalBillTotal = calculatedProduceTotal + appliedFee;

// //     const newOrder = await Order.create({
// //       userId,
// //       orderItems: verifiedOrderItems,
// //       deliveryAddress,
// //       deliveryFee: appliedFee,
// //       totalAmount: finalBillTotal,
// //       paymentMethod: paymentMethod || "COD"
// //     });

// //     // Phase 3: Stock update save
// //     for (const prod of productsToUpdate) {
// //       await prod.save();
// //     }

// //     return res.status(201).json({
// //       success: true,
// //       message: "Order placed successfully",
// //       order: newOrder
// //     });

// //   } catch (error) {
// //     console.log("createOrder error : ", error);
// //     return res.status(500).json({ success: false, message: error.message || "Internal server error" });
// //   }
// // };

// // // 2. Customer gets own orders (Populated Produce Info)
// // export const getMyOrders = async (req, res) => {
// //   try {
// //     const userId = req.user?.id || req.user?._id || req.user?.userId;
// //     if (!userId) {
// //       return res.status(401).json({ success: false, message: "Unauthorized" });
// //     }

// //     const orders = await Order.find({ userId })
// //       .populate({
// //         path: "orderItems.product",
// //         select: "name urduName imageURL price unit",
// //       })
// //       .sort({ createdAt: -1 });

// //     return res.status(200).json({
// //       success: true,
// //       count: orders.length,
// //       orders,
// //     });
// //   } catch (error) {
// //     console.log("getMyOrders error : ", error);
// //     return res.status(500).json({ success: false, message: "Internal server error" });
// //   }
// // };

// // // 3. Admin gets all orders
// // export const getAllOrders = async (req, res) => {
// //   try {
// //     const orders = await Order.find({})
// //       .populate("userId", "email phone name")
// //       .sort({ createdAt: -1 });

// //     return res.status(200).json({
// //       success: true,
// //       count: orders.length,
// //       orders,
// //     });
// //   } catch (error) {
// //     console.log("getAllOrders error : ", error);
// //     return res.status(500).json({ success: false, message: "Internal server error" });
// //   }
// // };

// // // 4. Update status
// // export const updateOrderStatus = async (req, res) => {
// //   try {
// //     const { status } = req.body;
// //     const orderId = req.params.id;

// //     if (!status) {
// //       return res.status(400).json({ success: false, message: "Status is required" });
// //     }

// //     const validStatuses = ["pending", "confirmed", "out for delivery", "delivered", "cancelled"];
// //     if (!validStatuses.includes(status.toLowerCase())) {
// //       return res.status(400).json({ success: false, message: "Invalid status value" });
// //     }

// //     const order = await Order.findByIdAndUpdate(
// //       orderId,
// //       { status: status.toLowerCase() },
// //       { new: true, runValidators: true }
// //     );

// //     if (!order) {
// //       return res.status(404).json({ success: false, message: "Order not found" });
// //     }

// //     return res.status(200).json({
// //       success: true,
// //       message: "Status updated successfully",
// //       order,
// //     });
// //   } catch (error) {
// //     console.log("updateOrderStatus error : ", error);
// //     return res.status(500).json({ success: false, message: "Internal server error" });
// //   }
// // };

// // // 5. Cancel full order (Only if pending + stock restore)
// // export const cancelOrder = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const order = await Order.findById(id);

// //     if (!order) {
// //       return res.status(404).json({ success: false, message: "Order not found" });
// //     }

// //     if (order.status !== "pending") {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Only pending orders can be cancelled!",
// //       });
// //     }

// //     // Restock items
// //     for (const item of order.orderItems) {
// //       await Product.findByIdAndUpdate(item.product, {
// //         $inc: { stockQuantity: item.quantity },
// //         $set: { isAvailable: true }
// //       });
// //     }

// //     order.status = "cancelled";
// //     await order.save();

// //     return res.status(200).json({
// //       success: true,
// //       message: "Order has been cancelled successfully.",
// //       order,
// //     });
// //   } catch (error) {
// //     return res.status(500).json({ success: false, message: error.message });
// //   }
// // };

// // // 6. Remove specific item (Only if pending + recalculate with delivery fee)
// // export const removeOrderItem = async (req, res) => {
// //   try {
// //     const { orderId, itemId } = req.params;
// //     const order = await Order.findById(orderId);

// //     if (!order) {
// //       return res.status(404).json({ success: false, message: "Order not found" });
// //     }

// //     if (order.status !== "pending") {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Items can only be removed while the order is pending!",
// //       });
// //     }

// //     const itemToRemove = order.orderItems.find((i) => i._id.toString() === itemId);

// //     if (itemToRemove) {
// //       // Restock removed item
// //       await Product.findByIdAndUpdate(itemToRemove.product, {
// //         $inc: { stockQuantity: itemToRemove.quantity },
// //         $set: { isAvailable: true }
// //       });
// //     }

// //     const updatedItems = order.orderItems.filter(
// //       (item) => item._id.toString() !== itemId
// //     );

// //     if (updatedItems.length === 0) {
// //       order.status = "cancelled";
// //       order.orderItems = [];
// //       order.totalAmount = 0;
// //     } else {
// //       order.orderItems = updatedItems;
// //       const produceTotal = updatedItems.reduce(
// //         (acc, curr) => acc + Number(curr.price || 0) * Number(curr.quantity || 1),
// //         0
// //       );
// //       order.totalAmount = produceTotal + Number(order.deliveryFee || 0);
// //     }

// //     await order.save();

// //     return res.status(200).json({
// //       success: true,
// //       message: "Item removed and order updated successfully.",
// //       order,
// //     });
// //   } catch (error) {
// //     return res.status(500).json({ success: false, message: error.message });
// //   }
// // };



// import Order from "../Models/Order.model.js";
// import Product from "../Models/Vegetable.model.js";

// // 1. Create New Order (Stock deduction + Dynamic Delivery Fee + Socket Real-time Emit)
// export const createOrder = async (req, res) => {
//   try {
//     const { orderItems, deliveryAddress, paymentMethod, deliveryFee } = req.body;

//     if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
//       return res.status(400).json({ success: false, message: "Cart items are required" });
//     }

//     if (!deliveryAddress?.address || !deliveryAddress?.phone) {
//       return res.status(400).json({ success: false, message: "Delivery address and phone are required" });
//     }

//     const userId = req.user?.id || req.user?._id || req.user?.userId;
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized, user missing" });
//     }

//     let calculatedProduceTotal = 0;
//     const verifiedOrderItems = [];
//     const productsToUpdate = [];

//     // Phase 1: Stock & Price Verification
//     for (const item of orderItems) {
//       if (!item.quantity || item.quantity <= 0) {
//         return res.status(400).json({ success: false, message: "Invalid quantity provided" });
//       }

//       const product = await Product.findById(item.product);

//       if (!product) {
//         return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
//       }

//       if (!product.isAvailable || product.stockQuantity < item.quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`,
//         });
//       }

//       calculatedProduceTotal += product.price * item.quantity;

//       verifiedOrderItems.push({
//         product: product._id,
//         name: product.name,
//         urduName: product.urduName,
//         imageURL: product.imageURL,
//         quantity: item.quantity,
//         unit: product.unit,
//         price: product.price,
//       });

//       product.stockQuantity -= item.quantity;
//       if (product.stockQuantity === 0) {
//         product.isAvailable = false;
//       }
//       productsToUpdate.push(product);
//     }

//     // Phase 2: Add Delivery Fee to Final Total
//     const appliedFee = Number(deliveryFee || 0);
//     const finalBillTotal = calculatedProduceTotal + appliedFee;

//     const newOrder = await Order.create({
//       userId,
//       orderItems: verifiedOrderItems,
//       deliveryAddress,
//       deliveryFee: appliedFee,
//       totalAmount: finalBillTotal,
//       paymentMethod: paymentMethod || "COD",
//     });

//     // Phase 3: Stock update save
//     for (const prod of productsToUpdate) {
//       await prod.save();
//     }

//     // Phase 4: Real-time Socket Event Emit to Admin
//     const io = req.app.get("io");
//     if (io) {
//       io.to("admin-room").emit("new-order-received", {
//         orderId: newOrder._id,
//         customerName: req.user?.name || "Customer",
//         customerPhone: deliveryAddress.phone,
//         totalAmount: newOrder.totalAmount,
//         itemsCount: newOrder.orderItems.length,
//         time: newOrder.createdAt || new Date(),
//       });
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Order placed successfully",
//       order: newOrder,
//     });
//   } catch (error) {
//     console.log("createOrder error : ", error);
//     return res.status(500).json({ success: false, message: error.message || "Internal server error" });
//   }
// };

// // 2. Customer gets own orders (Populated Produce Info)
// export const getMyOrders = async (req, res) => {
//   try {
//     const userId = req.user?.id || req.user?._id || req.user?.userId;
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const orders = await Order.find({ userId })
//       .populate({
//         path: "orderItems.product",
//         select: "name urduName imageURL price unit",
//       })
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders,
//     });
//   } catch (error) {
//     console.log("getMyOrders error : ", error);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// // 3. Admin gets all orders
// export const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({})
//       .populate("userId", "email phone name")
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders,
//     });
//   } catch (error) {
//     console.log("getAllOrders error : ", error);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// // 4. Update status
// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const orderId = req.params.id;

//     if (!status) {
//       return res.status(400).json({ success: false, message: "Status is required" });
//     }

//     const validStatuses = ["pending", "confirmed", "out for delivery", "delivered", "cancelled"];
//     if (!validStatuses.includes(status.toLowerCase())) {
//       return res.status(400).json({ success: false, message: "Invalid status value" });
//     }

//     const order = await Order.findByIdAndUpdate(
//       orderId,
//       { status: status.toLowerCase() },
//       { new: true, runValidators: true }
//     );

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Status updated successfully",
//       order,
//     });
//   } catch (error) {
//     console.log("updateOrderStatus error : ", error);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// // 5. Cancel full order (Only if pending + stock restore)
// export const cancelOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const order = await Order.findById(id);

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     if (order.status !== "pending") {
//       return res.status(400).json({
//         success: false,
//         message: "Only pending orders can be cancelled!",
//       });
//     }

//     // Restock items
//     for (const item of order.orderItems) {
//       await Product.findByIdAndUpdate(item.product, {
//         $inc: { stockQuantity: item.quantity },
//         $set: { isAvailable: true },
//       });
//     }

//     order.status = "cancelled";
//     await order.save();

//     return res.status(200).json({
//       success: true,
//       message: "Order has been cancelled successfully.",
//       order,
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // 6. Remove specific item (Only if pending + recalculate with delivery fee)
// export const removeOrderItem = async (req, res) => {
//   try {
//     const { orderId, itemId } = req.params;
//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     if (order.status !== "pending") {
//       return res.status(400).json({
//         success: false,
//         message: "Items can only be removed while the order is pending!",
//       });
//     }

//     const itemToRemove = order.orderItems.find((i) => i._id.toString() === itemId);

//     if (itemToRemove) {
//       await Product.findByIdAndUpdate(itemToRemove.product, {
//         $inc: { stockQuantity: itemToRemove.quantity },
//         $set: { isAvailable: true },
//       });
//     }

//     const updatedItems = order.orderItems.filter(
//       (item) => item._id.toString() !== itemId
//     );

//     if (updatedItems.length === 0) {
//       order.status = "cancelled";
//       order.orderItems = [];
//       order.totalAmount = 0;
//     } else {
//       order.orderItems = updatedItems;
//       const produceTotal = updatedItems.reduce(
//         (acc, curr) => acc + Number(curr.price || 0) * Number(curr.quantity || 1),
//         0
//       );
//       order.totalAmount = produceTotal + Number(order.deliveryFee || 0);
//     }

//     await order.save();

//     return res.status(200).json({
//       success: true,
//       message: "Item removed and order updated successfully.",
//       order,
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };



import Order from "../Models/Order.model.js";
import Product from "../Models/Vegetable.model.js";

// 1. Create New Order (Stock deduction + Dynamic Delivery Fee + Socket Real-time Emit)
export const createOrder = async (req, res) => {
  try {
    const { orderItems, deliveryAddress, paymentMethod, deliveryFee } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart items are required" });
    }

    if (!deliveryAddress?.address || !deliveryAddress?.phone) {
      return res.status(400).json({ success: false, message: "Delivery address and phone are required" });
    }

    const userId = req.user?.id || req.user?._id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized, user missing" });
    }

    let calculatedProduceTotal = 0;
    const verifiedOrderItems = [];
    const productsToUpdate = [];

    // Phase 1: Stock & Price Verification
    for (const item of orderItems) {
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ success: false, message: "Invalid quantity provided" });
      }

      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }

      if (!product.isAvailable || product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`,
        });
      }

      calculatedProduceTotal += product.price * item.quantity;

      verifiedOrderItems.push({
        product: product._id,
        name: product.name,
        urduName: product.urduName,
        imageURL: product.imageURL,
        quantity: item.quantity,
        unit: product.unit,
        price: product.price,
      });

      product.stockQuantity -= item.quantity;
      if (product.stockQuantity === 0) {
        product.isAvailable = false;
      }
      productsToUpdate.push(product);
    }

    // Phase 2: Add Delivery Fee to Final Total
    const appliedFee = Number(deliveryFee || 0);
    const finalBillTotal = calculatedProduceTotal + appliedFee;

    const newOrder = await Order.create({
      userId,
      orderItems: verifiedOrderItems,
      deliveryAddress,
      deliveryFee: appliedFee,
      totalAmount: finalBillTotal,
      paymentMethod: paymentMethod || "COD",
    });

    // Phase 3: Stock update save
    for (const prod of productsToUpdate) {
      await prod.save();
    }

    // Phase 4: Real-time Socket Event Emit to Admin Room
    const io = req.app.get("io");
    if (io) {
      console.log("📡 Emitting 'new-order-received' to admin-room...");
      io.to("admin-room").emit("new-order-received", {
        orderId: newOrder._id.toString(),
        customerName: req.user?.name || "Customer",
        customerPhone: deliveryAddress.phone,
        totalAmount: newOrder.totalAmount,
        itemsCount: newOrder.orderItems.length,
        time: newOrder.createdAt || new Date(),
      });
    } else {
      console.error("❌ io instance not found on req.app!");
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("createOrder error : ", error);
    return res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};

// 2. Customer gets own orders (Populated Produce Info)
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orders = await Order.find({ userId })
      .populate({
        path: "orderItems.product",
        select: "name urduName imageURL price unit",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("getMyOrders error : ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 3. Admin gets all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "email phone name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("getAllOrders error : ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 4. Update status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const validStatuses = ["pending", "confirmed", "out for delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: status.toLowerCase() },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      order,
    });
  } catch (error) {
    console.error("updateOrderStatus error : ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 5. Cancel full order (Only if pending + stock restore)
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled!",
      });
    }

    // Restock items
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: item.quantity },
        $set: { isAvailable: true },
      });
    }

    order.status = "cancelled";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order has been cancelled successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Remove specific item (Only if pending + recalculate with delivery fee)
export const removeOrderItem = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Items can only be removed while the order is pending!",
      });
    }

    const itemToRemove = order.orderItems.find((i) => i._id.toString() === itemId);

    if (itemToRemove) {
      await Product.findByIdAndUpdate(itemToRemove.product, {
        $inc: { stockQuantity: itemToRemove.quantity },
        $set: { isAvailable: true },
      });
    }

    const updatedItems = order.orderItems.filter(
      (item) => item._id.toString() !== itemId
    );

    if (updatedItems.length === 0) {
      order.status = "cancelled";
      order.orderItems = [];
      order.totalAmount = 0;
    } else {
      order.orderItems = updatedItems;
      const produceTotal = updatedItems.reduce(
        (acc, curr) => acc + Number(curr.price || 0) * Number(curr.quantity || 1),
        0
      );
      order.totalAmount = produceTotal + Number(order.deliveryFee || 0);
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Item removed and order updated successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};