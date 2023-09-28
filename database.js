const { MongoClient } = require("mongodb");

let dbConnection;

module.exports = {
  connectToDB: (cb) => {
    MongoClient.connect("mongodb://localhost:27017/bookstore")
      .then((client) => {
        dbConnection = client.db();
        console.log("Connected to database", dbConnection.databaseName);
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },

  getDB: () => dbConnection,
};
