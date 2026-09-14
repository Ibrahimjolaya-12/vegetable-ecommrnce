import jwt from "jsonwebtoken";

export const Auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token = null;
    if (authHeader && typeof authHeader === "string") {
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1].trim();
      } else token = authHeader.trim();
    } else if (req.cookies?.token) {
      token = req.cookies?.token;
    }

    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({
        success: false,
        message: "InValid ID, token access denied",
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Server configuration error: JWT_SECRET missing",
      });
    }

    const decoded = jwt.verify(token, secret);

    req.user = decoded;
    req.role = decoded.role;

    next();
  } catch (error) {
    console.log("Auth middleware error : ", error.message);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const isAdminAuth = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error, try again",
    });
  }
};
