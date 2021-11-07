module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.STRING,
    },
  });

  User.associate = function (models) {
    User.hasMany(models.finance);
  };

  return User;
};
