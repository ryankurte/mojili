var env = process.env.NODE_ENV || "development";

config = {
  development: {
    url: "localhost",
    database: "sqlite://dev.db",
    options: {
        logging: false,
        sync: true
    },
  },
  test: {
    url: "localhost",
    database: "sqlite://test.db",
    options: {
        logging: false,
        sync: true
    },
  },
  production: {
    url: process.env.URL,
    database: process.env.DATABASE_URL,
    options: {
        logging: false,
        sync: true
    },
  }
}

module.exports = config[env];