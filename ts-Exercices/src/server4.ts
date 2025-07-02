import express from "express";
import mysql from "mysql2/promise";
const app = express();
app.use(express.json());
// Créer une connexion MySQL
const db = mysql.createPool({
host: "localhost",
user: "root",
password: "password", //si vous avez un password sinon lissez ce champs vide
database: "testDb",
});
// Route GET pour récupérer tous les utilisateurs
app.get("/users", async (req, res) => {
const [rows] = await db.query("SELECT * FROM users");
res.json(rows);
});
// Route POST pour ajouter un utilisateur
app.post("/users", async (req, res) => {
const { name, email } = req.body;
if (!name || !email) {
return res.status(400).send("Name and email are required");
} 
const [result]:any = await db.execute(
"INSERT INTO users (name, email) VALUES (?, ?)",
[name, email]
);
res.status(201).json({ id: result.insertId, name, email });});
app.listen(3000, () => {
console.log("Serveur démarré sur http://localhost:3000");
});