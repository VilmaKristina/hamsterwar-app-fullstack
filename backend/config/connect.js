const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let database;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (db) {
        database = db.db("hamstersDB");
      }
      return callback(err);
    });
  },

  getDatabase: function () {
    console.log('Connected to database')
    return database;
  },
};
