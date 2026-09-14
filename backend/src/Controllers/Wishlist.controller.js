import { User } from "../Models/Auth.model.js";

// backend/src/Controllers/Wishlist.controller.js

export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Har item chahe ObjectId ho ya populated object, uski ID extract karo
    const isExist = user.wishlist.some((item) => {
      const existingId = item?._id ? item._id.toString() : item.toString();
      return existingId === productId.toString();
    });

    let updatedUser;
    let actionMessage = "";

    if (isExist) {
      // Remove karo
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { wishlist: productId } },
        { new: true }
      ).populate("wishlist");
      actionMessage = "Product removed from wishlist";
    } else {
      // Add karo
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { wishlist: productId } },
        { new: true }
      ).populate("wishlist");
      actionMessage = "Product added to wishlist";
    }

    return res.status(200).json({
      success: true,
      message: actionMessage,
      wishlist: updatedUser.wishlist,
    });
  } catch (error) {
    console.log("toggleWishlist error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 2. Get User Wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId).populate("wishlist");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      count: user.wishlist.length,
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.log("getWishlist error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
