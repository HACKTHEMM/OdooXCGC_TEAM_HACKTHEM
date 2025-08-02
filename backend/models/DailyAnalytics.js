// models/DailyAnalytics.js
const DailyAnalytics = (sequelize) => {
  return sequelize.define('DailyAnalytics', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    analyticsDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true,
      field: 'analytics_date'
    },
    totalIssuesReported: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'total_issues_reported'
    },
    totalIssuesResolved: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'total_issues_resolved'
    },
    totalActiveUsers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'total_active_users'
    },
    mostReportedCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'most_reported_category_id',
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    avgResolutionTimeHours: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      field: 'avg_resolution_time_hours'
    }
  }, {
    tableName: 'daily_analytics',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { fields: ['analytics_date'] }
    ]
  });
};
