const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :response-time ms - body: :body"));

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];

const generateId = () => Math.floor(Math.random() * 1000000).toString();

app.get("/api/persons", (req, res) => res.json(persons));

app.get("/info", (req, res) => {
  const count = persons.length;
  const date = new Date();
  res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((p) => p.id === req.params.id);
  person ? res.json(person) : res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  persons = persons.filter((p) => p.id !== req.params.id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  console.log("Received body:", body);

  if (!body.name || (!body.number && !body.telephoneNo)) {
    return res.status(400).json({ error: "name or number missing" });
  }

  const number = body.number || body.telephoneNo;

  const nameExists = persons.find(
    (p) => p.name.toLowerCase() === body.name.toLowerCase()
  );
  if (nameExists) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const person = { id: generateId(), name: body.name, number };
  persons = persons.concat(person);
  res.json(person);
});

// fallback for SPA — serve index.html for any unknown GET route
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
