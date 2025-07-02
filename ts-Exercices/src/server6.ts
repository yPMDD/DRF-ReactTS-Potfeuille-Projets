import express from "express";
import mysql from "mysql2/promise";

const app = express();
app.use(express.json());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "testDb",
});

// GET : Récupérer tous les utilisateurs
app.get("/users", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM users");
  res.json(rows);
});

// POST : Ajouter un utilisateur
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).send("Name and email are required");
  }
  const [result]:any = await db.execute(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email]
  );
  res.status(201).json({ id: result.insertId, name, email });
});

// PUT : Mettre à jour un utilisateur
app.put("/users/:id", async (req, res) => {
  const { name, email } = req.body;
  const { id } = req.params;
  if (!name || !email) {
    return res.status(400).send("Name and email are required");
  }
  await db.execute("UPDATE users SET name = ?, email = ? WHERE id = ?", [
    name,
    email,
    id,
  ]);
  res.send("Utilisateur mis à jour !");
});

// DELETE : Supprimer un utilisateur
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  await db.execute("DELETE FROM users WHERE id = ?", [id]);
  res.send("Utilisateur supprimé !");
});

app.listen(3000, () => {
  console.log("Serveur démarré sur http://localhost:3000");
});
