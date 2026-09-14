import cloudinary, { uploadOnCloudinary } from "../Config/cloudinary.js";
import Product from "../Models/Vegetable.model.js";

export const addVegetable = async (req, res) => {
  try {
    const userId =
      req.user?.id || req.user?._id || req.user?.userId || req.user?.uid;
    const {
      name,
      urduName,
      stockQuantity,
      isAvailable,
      unit,
      price,
      
    } = req.body;

    if (!name || !unit || !price) {
      return res
        .status(400)
        .json({ success: false, message: "Name, unit and price are required" });
    }

    let imageURL = req.body.imageURL || "";
    let publicId = "";

    if (req.file && req.file.path) {
      const uploadImage = await uploadOnCloudinary(req.file.path);
      if (uploadImage) {
        imageURL = uploadImage.secure_url;
        publicId = uploadImage.public_id;
      }
    }

    const createVegetable = await Product.create({
      name,
      urduName,
      stockQuantity,
      isAvailable,
      unit,
      price,
      userId,
      imageURL,
      publicId,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: createVegetable,
    });
  } catch (error) {
    console.log("addVegetable err : ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error or try again" });
  }
};

export const getAllVegetables = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.log("showVegetable err : ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error or try again" });
  }
};

export const getSingleVegetable = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });

    if (!product) {
      return res
        .status(404)
        .json({
          success: false,
          message: "This product not available right now",
        });
    }

    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.log("getSingleVegetable err : ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error or try again" });
  }
};

// export const updateVegetable = async (req, res) => {
//   try {
//     const {
//       name,
//       urduName,
//       stockQuantity,
//       isAvailable,
//       unit,
//       price,
//       imageURL,
//     } = req.body;
//     if (!name || !unit || !price) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Name, unit and price are required" });
//     }
//     const userId =
//       req.user?.id || req.user?._id || req.user?.userId || req.user?.uid;
//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized! User ID not found in token.",
//       });
//     }

//     const updatedProducts = {
//       name,
//       urduName,
//       stockQuantity,
//       isAvailable,
//       unit,
//       price,
//       imageURL,
//     };

//     const existingProduct = await Product.findOne({
//       userId,
//       _id: req.params.id,
//     });

//     if (!existingProduct) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No vegetable found" });
//     }

//     if (req.file && req.file.path) {
//       if (existingProduct.publicId) {
//         try {
//           await cloudinary.uploader.destroy(existingProduct.publicId);
//         } catch (error) {
//           console.log(error);
//         }
//       }
//       const uploadImage = await uploadOnCloudinary(req.file.path);

//       if (uploadImage) {
//         updatedProducts.imageURL = uploadImage.secure_url;
//         updatedProducts.publicId = uploadImage.public_id;
//       }
//     }

//     const product = await Product.findOneAndUpdate(
//       { _id: req.params.id, userId },
//       updatedProducts,
//       { new: true, runValidators: true },
//     );

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "product not found or unauthorized access",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Product updated Successfully",
//       product,
//     });
//   } catch (error) {
//     console.log("updateegetable err : ", error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal server error or try again" });
//   }
// };

// export const deleteVegetable = async (req, res) => {
//   try {
//     const userId =
//       req.user?.id || req.user?._id || req.user?.userId || req.user?.uid;
//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized! User ID not found in token.",
//       });
//     }
//     const product = await Product.findOneAndDelete({
//       userId,
//       _id: req.params.id,
//     });
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "product not found or unauthorized access",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Product deleted successfully",
//       product,
//     });
//   } catch (error) {
//     console.log("updatedVegetable error : ", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Internal server error or try again" });
//   }
// };





export const updateVegetable = async (req, res) => {
  try {
    const { name, urduName, stockQuantity, isAvailable, unit, price, imageURL } = req.body;

    if (!name || !unit || price === undefined) {
      return res.status(400).json({ success: false, message: "Name, unit and price are required" });
    }

    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "No vegetable found" });
    }

    const updatedData = {
      name,
      urduName,
      stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : existingProduct.stockQuantity,
      isAvailable: isAvailable !== undefined ? isAvailable : existingProduct.isAvailable,
      unit,
      price: Number(price),
      imageURL: imageURL || existingProduct.imageURL,
    };

    if (req.file && req.file.path) {
      if (existingProduct.publicId) {
        try {
          await cloudinary.uploader.destroy(existingProduct.publicId);
        } catch (err) {
          console.log("Cloudinary cleanup error:", err);
        }
      }
      const uploadImage = await uploadOnCloudinary(req.file.path);
      if (uploadImage) {
        updatedData.imageURL = uploadImage.secure_url;
        updatedData.publicId = uploadImage.public_id;
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log("updateVegetable error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteVegetable = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.publicId) {
      try {
        await cloudinary.uploader.destroy(product.publicId);
      } catch (err) {
        console.log("Cloudinary delete error:", err);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.log("deleteVegetable error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};