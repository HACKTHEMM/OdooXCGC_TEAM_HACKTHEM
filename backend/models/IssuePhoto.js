// models/IssuePhoto.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const IssuePhoto = sequelize.define('IssuePhoto', {
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
    photoUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: 'photo_url',
      validate: {
        notEmpty: true,
        isUrl: true
      }
    },
    photoOrder: {
      type: DataTypes.SMALLINT,
      defaultValue: 1,
      field: 'photo_order',
      validate: {
        min: 1,
        max: 3
      }
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'file_size',
      validate: {
        min: 0
      }
    },
    mimeType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'mime_type',
      validate: {
        isIn: [['image/jpeg', 'image/png', 'image/gif', 'image/webp']]
      }
    }
  }, {
    tableName: 'issue_photos',
    timestamps: true,
    createdAt: 'uploaded_at',
    updatedAt: false,
    indexes: [
      { fields: ['issue_id'] },
      { fields: ['photo_order'] },
      { 
        fields: ['issue_id', 'photo_order'], 
        unique: true,
        name: 'unique_issue_order'
      }
    ]
  });

  // Define associations
  IssuePhoto.associate = (models) => {
    IssuePhoto.belongsTo(models.Issue, {
      foreignKey: 'issueId',
      as: 'issue',
      onDelete: 'CASCADE'
    });
  };

  // Scopes
  IssuePhoto.addScope('ordered', {
    order: [['photoOrder', 'ASC']]
  });

  // Instance methods
  IssuePhoto.prototype.getFileSizeFormatted = function() {
    if (!this.fileSize) return null;
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (this.fileSize === 0) return '0 Byte';
    
    const i = parseInt(Math.floor(Math.log(this.fileSize) / Math.log(1024)));
    return Math.round(this.fileSize / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Validation hooks
  IssuePhoto.addHook('beforeCreate', async (photo) => {
    // Ensure we don't exceed 3 photos per issue
    const photoCount = await IssuePhoto.count({
      where: { issueId: photo.issueId }
    });
    
    if (photoCount >= 3) {
      throw new Error('Maximum 3 photos allowed per issue');
    }
    
    // Auto-assign photo order if not specified
    if (!photo.photoOrder) {
      const maxOrder = await IssuePhoto.max('photoOrder', {
        where: { issueId: photo.issueId }
      }) || 0;
      photo.photoOrder = maxOrder + 1;
    }
  });

  return IssuePhoto;
};