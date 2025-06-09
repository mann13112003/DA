'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PestDisease extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PestDisease.belongsTo(models.PestCategory, {
        foreignKey: 'category_id',
        as: 'category'
      });
    
      PestDisease.hasMany(models.PestDiseaseImage, {
        foreignKey: 'pest_id',
        as: 'images'
      });
    
      PestDisease.belongsToMany(models.GrowthStage, {
        through: 'PestDiseaseGrowthStage',
        foreignKey: 'pest_disease_id',
        otherKey: 'growth_stage_id',
        as: 'growthStages'
      });
      // define association here
    }
  };
  PestDisease.init(
    {
      name: DataTypes.STRING,
      scientific_name: DataTypes.STRING,
      category_id: DataTypes.INTEGER,
      descriptionMarkdown: DataTypes.TEXT('long'),
      descriptionHTML: DataTypes.TEXT('long'),
      image_file_id: DataTypes.STRING,
      image_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PestDisease",
    }
  );

  return PestDisease;
};
