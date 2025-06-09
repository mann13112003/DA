'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GrowthStage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GrowthStage.belongsToMany(models.PestDisease, {
        through: 'PestDiseaseGrowthStage',
        foreignKey: 'growth_stage_id',
        otherKey: 'pest_disease_id',
        as: 'pestDiseases'
      });
    }
  };
  GrowthStage.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "GrowthStage",
    }
  );

  return GrowthStage;
};
