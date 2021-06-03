const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const db =
  "mongodb+srv://john:1234@crud.6dzkh.mongodb.net/audio?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database...");
  } catch (error) {
    console.error(error.message);
    console.log("Error");
    process.exit(1);
  }
};

connectDB();

const RecordList = mongoose.Schema({
  title: {
    type: String,
  },
  uri: {
    type: String,
  },
  date: {
    type: String,
  },
});

const Record = mongoose.model("record", RecordList);

app.get("/", async (req, res) => {
  const recordings = await Record.find({});
  res.status(200).json({ recordings: recordings });
});

app.post("/add", (req, res) => {
  const recordings = req.body;

  recordings.map((rec) => {
    Record.create({ title: rec.title, uri: rec.uri, date: rec.date });
  });
  res.status(201).json({ success: "Recording saved!" });
});

app.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await Record.deleteOne({ _id: id });
  res.status(200).json({ succsse: `Recording ${id} has been deleted` });
});

app.listen(3001, () => console.log("Server running on port 3001"));
