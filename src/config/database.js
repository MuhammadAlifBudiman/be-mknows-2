const { NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

module.exports = {
  development: {
    dialect: "postgres",
    host: DB_HOST,

    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT,
    define: {
      underscored: true,
      freezeTableName: true,
      paranoid: true,

      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
    pool: {
      min: 0,
      max: 5,
    },
    logQueryParameters: NODE_ENV === "development",
    logging: false,
    benchmark: false,
  },
  production: {
    dialect: "postgres",
    host: DB_HOST,

    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT,
    define: {
      underscored: true,
      freezeTableName: true,
      paranoid: true,

      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
    logging: false,
    benchmark: false,
  }
}