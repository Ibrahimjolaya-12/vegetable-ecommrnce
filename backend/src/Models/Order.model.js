import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          trim: true,
        },
        urduName: {
          type: String,
          trim: true,
        },
        imageURL: {
          type: String,
          trim: true,
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          default: 1,
        },
        unit: {
          type: String,
          required: true,
          enum: ["kg", "gram", "dozen", "gaddi"],
          default: "kg",
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
          default: 0,
        },
      },
    ],
    deliveryAddress: {
      address: {
        type: String,
        required: [true, "Delivery address is required"],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
      },
      note: {
        type: String,
        trim: true,
      },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "out for delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    itemsPrice: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const Order = model("Order", orderSchema);

export default Order;