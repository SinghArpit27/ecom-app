import jwt from "jsonwebtoken";

// Authentication Access Token
export const authenticateToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];

    jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(403).json({ result: "Token Expires" });
      } else {
        const user = decoded; // The user data decoded from the token
        req.userId = user._id;
        next();
      }
    });
  } else {
    res.send({
      result: "Token Not Found",
    });
  }
};