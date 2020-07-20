module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    "Group",
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
    },
    {timeStamps: true}
  );
  Group.associate = (models) => {
    // associations can be defined here
    Group.hasMany(models.User, {
      onDelete: "cascade"
    });
  };
  return Group;
};
