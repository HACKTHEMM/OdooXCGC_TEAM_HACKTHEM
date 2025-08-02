// models/Notification.js
const Notification = (sequelize) => {
  return sequelize.define('Notification', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
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
    notificationType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'notification_type',
      validate: {
        isIn: [['status_change', 'comment', 'flag', 'resolution']]
      }
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_read'
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'read_at'
    }
  }, {
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['issue_id'] },
      { fields: ['is_read'] },
      { fields: ['created_at'] }
    ]
  });
};