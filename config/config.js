var env = process.env.NODE_ENV || "development";

config = {
  "development": {
    database: "sqlite://dev.db",
    options: {
        logging: false,
        sync: true
    },
  },
  "test": {
    "database": "sqlite://test.db",
  },
  "production": {
    "database": process.env.DATABASE_URL
  }
}

module.exports = config;