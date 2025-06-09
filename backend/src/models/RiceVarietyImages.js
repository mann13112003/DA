'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RiceVarietyImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RiceVarietyImage.belongsTo(models.RiceVariety, {foreignKey: 'riceVarietyId', as: 'rice'})
      // define association here
    }
  };
  RiceVarietyImage.init(
    {
      riceVarietyId: DataTypes.INTEGER,
      image_url: DataTypes.STRING,
      description: DataTypes.TEXT('long'),
    },
    {
      sequelize,
      modelName: "RiceVarietyImage",
    }
  );

  return RiceVarietyImage;
};
