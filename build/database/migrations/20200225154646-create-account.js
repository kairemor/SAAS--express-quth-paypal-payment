"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable("Users", {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER
    },
    firstName: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      unique: true
    },
    lastName: {
      type: Sequelize.STRING
    },
    verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    blocked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    groupId: {
      type: Sequelize.INTEGER,
      onDelete: "CASCADE",
      allowNull: false,
      references: {
        model: 'Groups',
        key: 'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: new Date()
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: new Date()
    }
  }),
  down: queryInterface => queryInterface.dropTable("Users")
};