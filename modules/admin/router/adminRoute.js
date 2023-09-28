import express from "express";
import { authenticateToken } from "../../../middleware/jwtAuthorization.js";
import { userDeleteController } from "../controller/adminController.js";

const route = express.Router();

route.use(authenticateToken);

route.post("/delete-user/:id", userDeleteController);

export default route;
