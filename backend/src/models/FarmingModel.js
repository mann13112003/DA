'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FarmingModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FarmingModel.init(
    {
      name: DataTypes.STRING,
      region: DataTypes.STRING,
      image: DataTypes.STRING,
      descriptionMarkdown: DataTypes.TEXT('long'),
      descriptionHTML: DataTypes.TEXT('long'),
    },
    {
      sequelize,
      modelName: "FarmingModel",
    }
  );

  return FarmingModel;
};
