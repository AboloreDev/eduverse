import express from "express";
import {
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
} from "../controller/auth.controller";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/refresh", refreshToken);

export default router;
