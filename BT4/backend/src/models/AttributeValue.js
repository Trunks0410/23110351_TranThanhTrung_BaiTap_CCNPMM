"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class AttributeValue extends Model {
    static associate(models) {
      AttributeValue.belongsTo(models.Attribute, { foreignKey: "attribute_id" });
      AttributeValue.belongsToMany(models.ProductVariant, {
        through: "variant_attribute_values",
        foreignKey: "attribute_value_id",
      });
    }
  }
  AttributeValue.init(
    {
      attribute_id: DataTypes.INTEGER,
      value_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AttributeValue",
      tableName: "attribute_values",
      underscored: true,
    },
  );
  return AttributeValue;
};
