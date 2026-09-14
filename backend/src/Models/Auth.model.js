import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name must be required"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "email must be required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password must be required"],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Phone Number must be required"],
      unique: true,
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "customer", "rider"],
      default: "customer",
    },
    wishlist: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Product", 
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const User = model("User", userSchema);