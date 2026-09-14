import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Vegetabe name must be required"],
      trim: true,
    },
    urduName: {
      type: String,
      trim: true,
    },
    imageURL: {
      type: String,
      trim: true,
      default: "",
    },
    publicId: {
      type: String,
      default: "",
    },
    stockQuantity: {
      type: Number,
      required: [true, "Vegetabe stock must be required"],
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    unit: {
      type: String,
      required: [true, "Vegetabe unit mass must be required"],
      trim: true,
      enum: ["kg", "gram", "dozen", "gaddi"],
      default: "kg",
    },
    price: {
      type: Number,
      required: [true, "Vegetabe price must be required"],
      min: 0,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const Product = model("Product", productSchema);

export default Product;
