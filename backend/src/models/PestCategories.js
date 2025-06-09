'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PestCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PestCategory.hasMany(models.PestDisease, {
        foreignKey: 'category_id',
        as: 'pestDiseases'
      });
    }
  };
  PestCategory.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PestCategory",
    }
  );

  return PestCategory;
};
