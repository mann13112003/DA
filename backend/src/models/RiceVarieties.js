'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RiceVariety extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RiceVariety.hasMany(models.RiceVarietyImage, {foreignKey: 'riceVarietyId',as: 'images'});
      RiceVariety.belongsToMany(models.RiceType, {through: 'RiceVarietyRiceTypes', foreignKey: 'riceVarietyId' ,otherKey: 'riceTypeId', as: 'RiceTypes'})
      // define association here
    }
  };
  RiceVariety.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT('long'),
      descriptionMarkdown: DataTypes.TEXT('long'),
      descriptionHTML: DataTypes.TEXT('long'),
      image_file_id: DataTypes.STRING,
      image_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "RiceVariety",
    }
  );

  return RiceVariety;
};
