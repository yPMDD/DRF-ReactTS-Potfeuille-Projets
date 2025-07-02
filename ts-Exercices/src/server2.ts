import express from "express";
const app = express();


app.use(express.json()); // Middleware pour parser les requêtes JSON


let users: { id: number; name: string; email: string }[] = [];
// Récupérer tous les utilisateurs


app.get("/users", (req, res) => {
res.json(users);
});


// Ajouter un utilisateur
app.post("/users", (req, res) => {
const { name, email } = req.body;

if (!name || !email) {
return res.status(400).json({ error: "Name and email are required" });
} 
const newUser = { id: users.length + 1, name, email };
users.push(newUser);
res.status(201).json(newUser);
});
// Récupérer un utilisateur spécifique
app.get("/users/:id", (req, res) => {
const user = users.find((u) => u.id === parseInt(req.params.id));
if (!user) {
return res.status(404).send("Utilisateur non trouvé");
} 
res.json(user);
});
app.listen(3000, () => {
console.log("Serveur démarré sur http://localhost:3000");
});