"use strict";
import productService from "../services/productService.js";

class ProductController {
  async getAllProducts(req, res) {
    try {
      const result = await productService.getProducts(req.query);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProductBySlug(req, res) {
    try {
      const { slug } = req.params;
      const product = await productService.getProductDetail(slug);
      
      // Lấy sản phẩm tương tự
      const similarProducts = await productService.getSimilarProducts(product.id, product.category_id);

      return res.status(200).json({
        success: true,
        data: {
          product,
          similarProducts,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new ProductController();
