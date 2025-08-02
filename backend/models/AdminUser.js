// models/AdminUser.js
const AdminUser = (sequelize) => {
  return sequelize.define('AdminUser', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    adminLevel: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'moderator',
      field: 'admin_level',
      validate: {
        isIn: [['moderator', 'admin', 'super_admin']]
      }
    },
    permissions: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'created_by',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    tableName: 'admin_users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { fields: ['is_active'] },
      { fields: ['admin_level'] }
    ]
  });
};