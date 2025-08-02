// models/IssueStatusLog.js
const { DataTypes } = require('sequelize');

const IssueStatusLog = (sequelize) => {
  return sequelize.define('IssueStatusLog', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    issueId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'issue_id',
      references: {
        model: 'issues',
        key: 'id'
      }
    },
    oldStatusId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'old_status_id',
      references: {
        model: 'issue_status',
        key: 'id'
      }
    },
    newStatusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'new_status_id',
      references: {
        model: 'issue_status',
        key: 'id'
      }
    },
    changedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'changed_by',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    changeReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'change_reason'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'issue_status_log',
    timestamps: true,
    createdAt: 'changed_at',
    updatedAt: false,
    indexes: [
      { fields: ['issue_id'] },
      { fields: ['changed_at'] }
    ]
  });
};
