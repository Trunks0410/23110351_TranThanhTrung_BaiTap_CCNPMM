"use strict";
import express from "express";
import productController from "../controllers/productController.js";

const router = express.Router();

router.get("/all", productController.getAllProducts);
router.get("/detail/:slug", productController.getProductBySlug);

export default router;
