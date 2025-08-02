// models/IssueStatus.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const IssueStatus = sequelize.define('IssueStatus', {
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
    colorCode: {
      type: DataTypes.STRING(7),
      allowNull: true,
      field: 'color_code',
      validate: {
        is: /^#[0-9A-F]{6}$/i // Hex color validation
      }
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'sort_order'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    tableName: 'issue_status',
    timestamps: false,
    indexes: [
      { fields: ['is_active'] },
      { fields: ['sort_order'] },
      { fields: ['name'] }
    ]
  });

  // Define associations
  IssueStatus.associate = (models) => {
    IssueStatus.hasMany(models.Issue, {
      foreignKey: 'statusId',
      as: 'issues'
    });
    
    IssueStatus.hasMany(models.IssueStatusLog, {
      foreignKey: 'oldStatusId',
      as: 'oldStatusLogs'
    });
    
    IssueStatus.hasMany(models.IssueStatusLog, {
      foreignKey: 'newStatusId',
      as: 'newStatusLogs'
    });
  };

  // Scopes
  IssueStatus.addScope('active', {
    where: {
      isActive: true
    },
    order: [['sortOrder', 'ASC']]
  });

  // Class methods
  IssueStatus.getDefaultStatus = async function() {
    return await this.findOne({
      where: { name: 'Reported' }
    });
  };

  IssueStatus.getResolvedStatus = async function() {
    return await this.findOne({
      where: { name: 'Resolved' }
    });
  };

  return IssueStatus;
};