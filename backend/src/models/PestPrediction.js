'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PestPrediction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PestPrediction.init(
    {
      image_path: DataTypes.STRING,
      prediction_label: DataTypes.STRING,
      confidence_score: DataTypes.FLOAT,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PestPrediction",
    }
  );

  return PestPrediction;
};
