// models/IssueFlag.js
const IssueFlag = (sequelize) => {
  return sequelize.define('IssueFlag', {
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
    flaggerId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'flagger_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    flagReason: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'flag_reason',
      validate: {
        isIn: [['spam', 'inappropriate', 'duplicate', 'false_report', 'other']]
      }
    },
    flagDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'flag_description'
    }
  }, {
    tableName: 'issue_flags',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { fields: ['issue_id'] },
      { fields: ['flagger_id'] },
      { fields: ['flag_reason'] },
      { 
        fields: ['issue_id', 'flagger_id'], 
        unique: true,
        name: 'unique_user_flag'
      }
    ]
  });
};
