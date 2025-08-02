// models/Issue.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Issue = sequelize.define('Issue', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'category_id',
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // Default to 'Reported'
      field: 'status_id',
      references: {
        model: 'issue_status',
        key: 'id'
      }
    },
    reporterId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'reporter_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_anonymous'
    },
    // Location using PostGIS POINT geometry (handled as string in Sequelize)
    location: {
      type: DataTypes.GEOMETRY('POINT', 4326),
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
      validate: {
        min: -90,
        max: 90
      }
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
      validate: {
        min: -180,
        max: 180
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    locationDescription: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'location_description'
    },
    isFlagged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      field: 'is_flagged'
    },
    flagCount: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
      field: 'flag_count'
    },
    isHidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      field: 'is_hidden'
    },
    isResolved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      field: 'is_resolved'
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'resolved_at'
    }
  }, {
    tableName: 'issues',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['category_id'] },
      { fields: ['status_id'] },
      { fields: ['reporter_id'] },
      { fields: ['created_at'] },
      { fields: ['is_flagged'] },
      { fields: ['is_hidden'] },
      { fields: ['is_resolved'] },
      { fields: ['category_id', 'status_id'] },
      { fields: ['status_id', 'created_at'] },
      { fields: ['category_id', 'created_at'] },
      { fields: ['latitude', 'longitude'] }
    ],
    hooks: {
      beforeCreate: (issue) => {
        // Set location geometry from lat/lng
        if (issue.latitude && issue.longitude) {
          issue.location = {
            type: 'Point',
            coordinates: [issue.longitude, issue.latitude]
          };
        }
      },
      beforeUpdate: (issue) => {
        // Update location geometry if lat/lng changed
        if (issue.changed('latitude') || issue.changed('longitude')) {
          issue.location = {
            type: 'Point',
            coordinates: [issue.longitude, issue.latitude]
          };
        }
        
        // Update resolved status and timestamp
        if (issue.changed('statusId')) {
          // Assuming status ID 3 is 'Resolved'
          if (issue.statusId === 3 && issue.previous('statusId') !== 3) {
            issue.resolvedAt = new Date();
            issue.isResolved = true;
          } else if (issue.statusId !== 3 && issue.previous('statusId') === 3) {
            issue.resolvedAt = null;
            issue.isResolved = false;
          }
        }
      }
    }
  });

  // Define associations
  Issue.associate = (models) => {
    Issue.belongsTo(models.User, {
      foreignKey: 'reporterId',
      as: 'reporter'
    });
    
    Issue.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });
    
    Issue.belongsTo(models.IssueStatus, {
      foreignKey: 'statusId',
      as: 'status'
    });
    
    Issue.hasMany(models.IssuePhoto, {
      foreignKey: 'issueId',
      as: 'photos'
    });
    
    Issue.hasMany(models.IssueStatusLog, {
      foreignKey: 'issueId',
      as: 'statusLogs'
    });
    
    Issue.hasMany(models.Notification, {
      foreignKey: 'issueId',
      as: 'notifications'
    });
    
    Issue.hasMany(models.IssueFlag, {
      foreignKey: 'issueId',
      as: 'flags'
    });
  };

  // Scopes
  Issue.addScope('visible', {
    where: {
      isHidden: false
    }
  });

  Issue.addScope('withDetails', {
    include: [
      { model: sequelize.models.Category, as: 'category' },
      { model: sequelize.models.IssueStatus, as: 'status' },
      { model: sequelize.models.User, as: 'reporter', attributes: ['id', 'userName'] }
    ]
  });

  // Instance methods
  Issue.prototype.getDistance = function(lat, lng) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat - this.latitude) * Math.PI / 180;
    const dLng = (lng - this.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.latitude * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Class methods
  Issue.findNearby = async function(lat, lng, radiusKm = 5, options = {}) {
    const query = `
      SELECT *, 
      ST_Distance(
        ST_GeogFromText('POINT(' || $2 || ' ' || $1 || ')'),
        location
      ) / 1000 as distance_km
      FROM issues 
      WHERE ST_DWithin(
        ST_GeogFromText('POINT(' || $2 || ' ' || $1 || ')'),
        location,
        $3 * 1000
      )
      AND is_hidden = false
      ORDER BY distance_km ASC
      LIMIT $4
    `;
    
    const [results] = await sequelize.query(query, {
      bind: [lat, lng, radiusKm, options.limit || 50],
      type: sequelize.QueryTypes.SELECT
    });
    
    return results;
  };

  return Issue;
};