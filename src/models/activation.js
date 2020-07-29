module.exports = (sequelize, DataTypes) => {
  const Activation = sequelize.define(
    "Activation", {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
      },
      key: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
      used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
    }, {
      timeStamps: true
    }
  );
  Activation.associate = function (models) {
    // associations can be defined here
    Activation.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Activation;
};