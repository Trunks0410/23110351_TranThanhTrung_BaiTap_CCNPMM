"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Attribute extends Model {
    static associate(models) {
      Attribute.hasMany(models.AttributeValue, { foreignKey: "attribute_id" });
    }
  }
  Attribute.init(
    {
      attribute_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Attribute",
      tableName: "attributes",
      underscored: true,
    },
  );
  return Attribute;
};
