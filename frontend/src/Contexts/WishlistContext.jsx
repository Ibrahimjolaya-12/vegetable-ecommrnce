import { createContext, useContext, useState, useEffect } from "react";
import api from "../Api/axiosInstance";
import { useAuth } from "./AuthContext";
import { message } from "antd";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // 1. Initial Fetch jab user login ho
  const fetchWishlist = async () => {
    if (!token) {
      setWishlistItems([]);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/wishlist");
      const list = res.data?.wishlist || [];
      setWishlistItems(Array.isArray(list) ? list : []);
    } catch (error) {
      console.log("Fetch wishlist error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  // 2. Global Toggle Function (Add / Remove)
  const toggleWishlist = async (productId) => {
    if (!token) {
      message.warning("Wishlist use karne ke liye pehle login karein!");
      return false;
    }

    try {
      const res = await api.post("/wishlist/toggle", { productId });
      if (res.data?.success) {
        message.success(res.data.message);
        setWishlistItems(res.data.wishlist || []);
        return true;
      }
    } catch (error) {
      console.log("Toggle error:", error);
      message.error(error.response?.data?.message || "Wishlist update fail!");
      return false;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        toggleWishlist,
        loading,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);