'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'PestDiseaseGrowthStage',
      {
        pest_disease_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true, // ✅ Composite key trực tiếp
          references: {
            model: 'PestDiseases',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        growth_stage_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true, // ✅ Composite key trực tiếp
          references: {
            model: 'GrowthStages',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      },
      {
        id: false // ✅ Ngăn Sequelize tạo cột id
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PestDiseaseGrowthStage');
  }
};
