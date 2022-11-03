import express from "express";
import controller from "../controllers/auth";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

router.get("/google", controller.authUser);
router.get("/google/callback", controller.callback);
router.get("/logout", controller.logout);
router.get("/user", isAuthenticated, controller.getUser);

export default router;
