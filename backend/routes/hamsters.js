const express = require("express");
const { ObjectId } = require("mongodb");
const multer = require("multer");

const databaseRoutes = express.Router();
const toConnect = require("../config/connect");

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Format is not allowed"));
  }
};
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, fileFilter: fileFilter });

databaseRoutes.get("/", (req, res) => {
  res.send("Server is working");
});

// 1. GET	/hamsters
databaseRoutes.get("/hamsters", (req, res) => {
  let db = toConnect.getDatabase("hamstersDB");
  db.collection("hamsters")
    .find({})
    .sort({ _id: -1 })
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// 2. GET	/hamsters/random
databaseRoutes.get("/hamsters/random", (req, res) => {
  let db = toConnect.getDatabase("hamstersDB");
  try {
    let randomNumber = [{ $sample: { size: 2 } }];
    db.collection("hamsters")
      .aggregate(randomNumber)
      .toArray(function (err, result) {
        if (err) throw err("No results found!");
        console.log(result);
        res.status(200).json(result);
      });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 3. GET	/hamsters/:id
databaseRoutes.get("/hamsters/:id", (req, res) => {
  let db = toConnect.getDatabase("hamstersDB");
  if (ObjectId.isValid(req.params.id)) {
    db.collection("hamsters")
      .findOne({ _id: ObjectId(req.params.id) })
      .then((doc) => {
        if (doc) {
          res.status(200).json(doc);
        } else {
          res.status(404).json({ error: "Object not found" });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: "Internal Server Error" });
      });
  } else {
    res.status(404).json({ error: "Object not found" });
  }
});

// 4. POST	/hamsters
databaseRoutes.post("/hamsters", upload.single("imgName"), (req, res) => {
  let db = toConnect.getDatabase("hamstersDB");
  const buff = req.file.buffer.toString("base64");
  const hamster = {
    name: req.body.name,
    age: parseInt(req.body.age),
    favFood: req.body.favFood,
    loves: req.body.loves,
    imgName: buff,
    wins: 0,
    defeats: 0,
    games: 0,
  };

  db.collection("hamsters")
    .insertOne(hamster)
    .then((result) => {
      res.status(200).json(hamster);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ err: "A new hamster could not be posted at this moment" });
    });
});

// 5. PUT	/hamsters/:id
databaseRoutes.put("/hamsters/:id", (req, res) => {
  let db = toConnect.getDatabase("hamstersDB");
  let query = { _id: ObjectId(req.params.id) };
  let updatedHamster = {
    name: req.body.name,
    age: parseInt(req.body.age),
    favFood: req.body.favFood,
    loves: req.body.loves,
    imgName: buff,
    wins: req.body.wins,
    defeats: req.body.defeats,
    games: req.body.games,
  };

  db.collection("hamsters")
    .updateOne(query, updatedHamster)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err: "Hamster could not be updated" });
    });
});

// 6. DELETE	/hamsters/:id
databaseRoutes.delete("/hamsters/:id", (req, res) => {
  let db = toConnect.getDatabase("hamstersDB");
  if (ObjectId.isValid(req.params.id)) {
    db.collection("hamsters")
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        if (result.deletedCount !== 0) {
          res.status(200).json(result);
        } else {
          res.status(404).json({ error: "No object with this ID was found" });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not delete the document" });
      });
  } else {
    res.status(404).json({ error: "No object with this ID was found" });
  }
});

// 7. PUT	/hamsters/winner/:id
databaseRoutes.put("/hamsters/winner/:id", (req, res) => {
  let db = toConnect.getDatabase("hamstersDB");
  let query = { _id: ObjectId(req.params.id) };
  let increaseValue = {
    $inc: { wins: 1, games: 1 },
  };

  db.collection("hamsters")
    .updateOne(query, increaseValue)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err: "Hamster could not be updated" });
    });
});

// 8. PUT	/hamsters/loser/:id
databaseRoutes.put("/hamsters/loser/:id", (req, res) => {
  let db = toConnect.getDatabase("hamstersDB");
  let query = { _id: ObjectId(req.params.id) };
  let decreaseValue = {
    $inc: { defeats: 1, games: 1 },
  };

  db.collection("hamsters")
    .updateOne(query, decreaseValue)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err: "Hamster could not be updated" });
    });
});

module.exports = databaseRoutes;
