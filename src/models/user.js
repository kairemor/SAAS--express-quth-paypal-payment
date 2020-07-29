module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User", {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      blocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      profileId: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },
      isSubscribed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    }, {
      timeStamps: true
    }
  );
  User.associate = function (models) {
    // associations can be defined here
    User.belongsTo(models.Group, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
    User.hasMany(models.Activation, {
      onDelete: "cascade"
    })
  };
  return User;
};