"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class ProductImage extends Model {
    static associate(models) {
      ProductImage.belongsTo(models.Product, { foreignKey: "product_id" });
    }
  }
  ProductImage.init(
    {
      product_id: DataTypes.INTEGER,
      image_url: DataTypes.STRING,
      is_main: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "ProductImage",
      tableName: "product_images",
      underscored: true,
    },
  );
  return ProductImage;
};
