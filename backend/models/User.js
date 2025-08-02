// models/User.js
import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

export default (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    userName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'user_name',
      validate: {
        notEmpty: true,
        len: [3, 50]
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: [0, 20]
      }
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_verified'
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_anonymous'
    },
    isBanned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_banned'
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['user_name'] },
      { fields: ['email'] },
      { fields: ['is_verified'] },
      { fields: ['is_banned'] }
    ],
    hooks: {
      beforeCreate: async (user) => {
        if (user.passwordHash) {
          const salt = await bcrypt.genSalt(10);
          user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('passwordHash')) {
          const salt = await bcrypt.genSalt(10);
          user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        }
      }
    }
  });

  // Instance methods
  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.passwordHash);
  };

  User.prototype.toSafeJSON = function() {
    const userObj = this.toJSON();
    delete userObj.passwordHash;
    return userObj;
  };

  // Class methods
  User.findByCredentials = async function(email, password) {
    const user = await this.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      throw new Error('Invalid login credentials');
    }
    
    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      throw new Error('Invalid login credentials');
    }
    
    return user;
  };

  // Define associations
  User.associate = (models) => {
    User.hasMany(models.Issue, {
      foreignKey: 'reporterId',
      as: 'reportedIssues'
    });
    
    User.hasMany(models.IssueFlag, {
      foreignKey: 'flaggerId',
      as: 'flags'
    });
    
    User.hasMany(models.Notification, {
      foreignKey: 'userId',
      as: 'notifications'
    });
    
    User.hasMany(models.UserLocation, {
      foreignKey: 'userId',
      as: 'locations'
    });
    
    User.hasOne(models.AdminUser, {
      foreignKey: 'userId',
      as: 'adminProfile'
    });
  };

  return User;
};