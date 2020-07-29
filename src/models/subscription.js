module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define(
    "Subscription", {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
      },
      profile_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      plan_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      start_time: {
        type: DataTypes.STRING,
        allowNull: false
      },
    }, {
      timeStamps: true
    }
  );

  return Subscription;
};