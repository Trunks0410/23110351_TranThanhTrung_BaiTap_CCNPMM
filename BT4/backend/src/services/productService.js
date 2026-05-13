"use strict";
import db from "../models/index.js";
import { Op } from "sequelize";

class ProductService {
  async getProducts(queryParams) {
    const {
      category_id,
      min_price,
      max_price,
      search,
      sort_by = "created_at",
      sort_order = "DESC",
      type, // 'new', 'sale', 'bestseller'
      limit = 10,
      offset = 0,
    } = queryParams;

    const where = {};
    if (category_id) where.category_id = category_id;
    if (search) {
      where.product_name = { [Op.like]: `%${search}%` };
    }

    // Logic for 'type'
    let order = [[sort_by, sort_order]];
    if (type === "new") order = [["created_at", "DESC"]];
    if (type === "sale") where.is_promotion = true;
    
    const include = [
      {
        model: db.ProductImage,
        where: { is_main: true },
        required: false,
      },
      {
        model: db.ProductVariant,
        attributes: ["price", "stock_quantity", "sold_quantity"],
        where: {},
      },
    ];

    if (min_price || max_price) {
      const priceWhere = {};
      if (min_price) priceWhere[Op.gte] = min_price;
      if (max_price) priceWhere[Op.lte] = max_price;
      include[1].where.price = priceWhere;
    }

    if (type === "bestseller") {
        order = [[db.ProductVariant, "sold_quantity", "DESC"]];
    }

    const { count, rows } = await db.Product.findAndCountAll({
      where,
      include,
      order,
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true,
    });

    return {
      total: count,
      products: rows,
    };
  }

  async getProductDetail(slug) {
    const product = await db.Product.findOne({
      where: { slug },
      include: [
        {
          model: db.Category,
          attributes: ["category_name"],
        },
        {
          model: db.ProductImage,
          attributes: ["image_url", "is_main"],
        },
        {
          model: db.ProductVariant,
          include: [
            {
              model: db.AttributeValue,
              through: { attributes: [] },
              include: [
                {
                  model: db.Attribute,
                  attributes: ["attribute_name"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!product) {
      throw new Error("Sản phẩm không tồn tại");
    }

    console.log("DEBUG Product Detail:", JSON.stringify(product, null, 2));
    return product;
  }

  async getSimilarProducts(productId, categoryId) {
    return await db.Product.findAll({
      where: {
        category_id: categoryId,
        id: { [Op.ne]: productId },
      },
      include: [
        {
          model: db.ProductImage,
          where: { is_main: true },
          required: false,
        },
        {
          model: db.ProductVariant,
          attributes: ["price"],
        },
      ],
      limit: 4,
    });
  }
}

export default new ProductService();
