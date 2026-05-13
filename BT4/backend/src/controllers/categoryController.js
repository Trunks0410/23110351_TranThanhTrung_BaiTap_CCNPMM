"use strict";
import db from "../models/index.js";

class CategoryController {
  async getAllCategories(req, res) {
    try {
      const categories = await db.Category.findAll();
      return res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new CategoryController();
