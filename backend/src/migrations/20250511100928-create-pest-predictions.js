'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PestPredictions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      image_path: {
        type: Sequelize.STRING,
        allowNull: true
      },
      prediction_label: {
        type: Sequelize.STRING,
        allowNull: true
      },
      confidence_score: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'         
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE' 
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PestPredictions');
  }
};