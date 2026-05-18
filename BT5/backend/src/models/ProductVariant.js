"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class ProductVariant extends Model {
    static associate(models) {
      ProductVariant.belongsTo(models.Product, { foreignKey: "product_id" });
      ProductVariant.belongsToMany(models.AttributeValue, {
        through: "variant_attribute_values",
        foreignKey: "variant_id",
      });
    }
  }
  ProductVariant.init(
    {
      product_id: DataTypes.INTEGER,
      sku: DataTypes.STRING,
      price: DataTypes.DECIMAL(15, 2),
      stock_quantity: DataTypes.INTEGER,
      sold_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "ProductVariant",
      tableName: "product_variants",
      underscored: true,
    },
  );
  return ProductVariant;
};
