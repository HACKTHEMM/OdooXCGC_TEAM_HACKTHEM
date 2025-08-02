// models/Category.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    iconUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'icon_url',
      validate: {
        isUrl: true
      }
    },
    colorCode: {
      type: DataTypes.STRING(7),
      allowNull: true,
      field: 'color_code',
      validate: {
        is: /^#[0-9A-F]{6}$/i // Hex color validation
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    tableName: 'categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { fields: ['is_active'] },
      { fields: ['name'] }
    ]
  });

  // Define associations
  Category.associate = (models) => {
    Category.hasMany(models.Issue, {
      foreignKey: 'categoryId',
      as: 'issues'
    });
    
    Category.hasMany(models.DailyAnalytics, {
      foreignKey: 'mostReportedCategoryId',
      as: 'analyticsRecords'
    });
  };

  // Scopes
  Category.addScope('active', {
    where: {
      isActive: true
    }
  });

  return Category;
};