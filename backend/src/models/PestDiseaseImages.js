'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PestDiseaseImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PestDiseaseImage.belongsTo(models.PestDisease, {
        foreignKey: 'pest_id',
        as: 'pest'
      });
      // define association here
    }
  };
  PestDiseaseImage.init(
    {
      pest_id: DataTypes.INTEGER,
      image_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PestDiseaseImage",
    }
  );

  return PestDiseaseImage;
};
