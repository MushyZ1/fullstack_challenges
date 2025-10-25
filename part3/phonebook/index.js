require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URI;
mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name required!"],
    minlength: [3, "Name must be at least 3 chars dawg!"],
  },
  telephoneNo: {
    type: String,
    minLength: [8, "Number must be 8 numbers or more"],
    validate: {
      validator: (v) => {
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "phone number required"],
  },
});

personSchema.set("toJSON", {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :response-time ms - body: :body"));

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => res.json(persons))
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res, next) => {
  Person.countDocuments({})
    .then((count) => {
      const date = new Date();
      res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const { name, telephoneNo } = req.body;

  if (!name || !telephoneNo) {
    return res.status(400).json({ error: "name or number missing" });
  }

  Person.findOne({ name })
    .then((existingPerson) => {
      if (existingPerson) {
        existingPerson.telephoneNo = telephoneNo;
        return existingPerson
          .save()
          .then((updatedPerson) => res.json(updatedPerson))
          .catch((error) => next(error));
      }

      const person = new Person({ name, telephoneNo });
      return person
        .save()
        .then((savedPerson) => res.json(savedPerson))
        .catch((error) => next(error));
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, telephoneNo } = req.body;
  Person.findById(req.params.id)
    .then((person) => {
      if (!person) return res.status(404).end();
      person.name = name;
      person.telephoneNo = telephoneNo;
      return person.save().then((updated) => res.json(updated));
    })
    .catch((err) => next(err));
});

const unknownEndpoint = (req, res) =>
  res.status(404).send({ error: "unknown endpoint" });
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError")
    return res.status(400).send({ error: "malformatted id" });
  if (error.name === "ValidationError") {
    console.error("Validation failed:", error.message);
    return res.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
