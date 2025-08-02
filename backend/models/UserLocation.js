// models/UserLocation.js
const UserLocation = (sequelize) => {
  return sequelize.define('UserLocation', {
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
    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_primary'
    }
  }, {
    tableName: 'user_locations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['is_primary'] },
      { fields: ['user_id', 'updated_at'] }
    ],
    hooks: {
      beforeCreate: (userLocation) => {
        if (userLocation.latitude && userLocation.longitude) {
          userLocation.location = {
            type: 'Point',
            coordinates: [userLocation.longitude, userLocation.latitude]
          };
        }
      },
      beforeUpdate: (userLocation) => {
        if (userLocation.changed('latitude') || userLocation.changed('longitude')) {
          userLocation.location = {
            type: 'Point',
            coordinates: [userLocation.longitude, userLocation.latitude]
          };
        }
      }
    }
  });
};
