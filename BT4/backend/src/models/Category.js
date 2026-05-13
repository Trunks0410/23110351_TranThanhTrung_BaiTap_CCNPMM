"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Product, { foreignKey: "category_id" });
    }
  }
  Category.init(
    {
      category_name: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "categories",
      underscored: true,
    },
  );
  return Category;
};
