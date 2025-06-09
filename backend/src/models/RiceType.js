'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RiceType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RiceType.belongsToMany(models.RiceVariety, {through: 'RiceVarietyRiceTypes', foreignKey: 'riceTypeId' ,otherKey: 'riceVarietyId', as: 'rices'});
      // define association here
    }
  };
  RiceType.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "RiceType",
    }
  );

  return RiceType;
};
