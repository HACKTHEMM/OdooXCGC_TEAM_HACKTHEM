const AdminAction = (sequelize) => {
  return sequelize.define('AdminAction', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    adminId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'admin_id',
      references: {
        model: 'admin_users',
        key: 'id'
      }
    },
    actionType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'action_type',
      validate: {
        isIn: [['ban_user', 'unban_user', 'hide_issue', 'unhide_issue', 'delete_issue', 'resolve_flag']]
      }
    },
    targetType: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'target_type',
      validate: {
        isIn: [['user', 'issue', 'flag']]
      }
    },
    targetId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'target_id'
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    tableName: 'admin_actions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { fields: ['admin_id'] },
      { fields: ['action_type'] },
      { fields: ['target_type', 'target_id'] },
      { fields: ['created_at'] }
    ]
  });
};
