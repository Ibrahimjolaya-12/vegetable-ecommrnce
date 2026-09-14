import Setting from "../Models/Setting.model.js";

// 1. GET Delivery Fee
export const getDeliveryFee = async (req, res) => {
  try {
    let setting = await Setting.findOne({ key: "global_settings" });
    if (!setting) {
      setting = await Setting.create({ key: "global_settings", deliveryFee: 50 });
    }
    return res.status(200).json({
      success: true,
      deliveryFee: setting.deliveryFee,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. UPDATE Delivery Fee
export const updateDeliveryFee = async (req, res) => {
  try {
    const { deliveryFee } = req.body;

    if (deliveryFee === undefined || isNaN(Number(deliveryFee))) {
      return res.status(400).json({
        success: false,
        message: "Valid delivery fee number required",
      });
    }

    const setting = await Setting.findOneAndUpdate(
      { key: "global_settings" },
      { deliveryFee: Number(deliveryFee) },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Delivery fee updated successfully",
      deliveryFee: setting.deliveryFee,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};