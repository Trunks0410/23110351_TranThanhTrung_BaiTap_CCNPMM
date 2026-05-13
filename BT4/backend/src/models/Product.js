"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, { foreignKey: "category_id" });
      Product.hasMany(models.ProductVariant, { foreignKey: "product_id" });
      Product.hasMany(models.ProductImage, { foreignKey: "product_id" });
    }
  }
  Product.init(
    {
      category_id: DataTypes.INTEGER,
      product_name: DataTypes.STRING,
      description: DataTypes.TEXT,
      slug: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
      is_promotion: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
      underscored: true,
    },
  );
  return Product;
};
