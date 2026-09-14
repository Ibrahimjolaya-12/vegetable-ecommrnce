import { Schema, model } from "mongoose";

const settingSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "global_settings",
    },
    deliveryFee: {
      type: Number,
      required: true,
      default: 50,
    },
  },
  { timestamps: true }
);

const Setting = model("Setting", settingSchema);

export default Setting;