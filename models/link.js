'use strict';
module.exports = function(sequelize, DataTypes) {
  var link = sequelize.define('link', {
    emoji_url: {type: DataTypes.TEXT, unique: true},
    real_url: {type: DataTypes.TEXT, unique: true}
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return link;
};