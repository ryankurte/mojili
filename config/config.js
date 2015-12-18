var env = process.env.NODE_ENV || "development";

config = {
  "development": {
    url: "localhost",
    database: "sqlite://dev.db",
    options: {
        logging: false,
        sync: true
    },
  },
  "test": {
    url: "localhost",
    "database": "sqlite://test.db",
  },
  "production": {
    url: process.env.URL,
    "database": process.env.DATABASE_URL
  }
}

module.exports = config;