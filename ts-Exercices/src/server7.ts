import express from "express";
const app = express();
app.use(express.json());
const users = [{ email: "user@example.com", password: "1234" }];
const tokens: string[] = [];
// Route de connexion
app.post("/login", (req, res) => {
const { email, password } = req.body;
const user = users.find((u) => u.email === email && u.password ===
password);
if (!user) {
return res.status(401).send("Email ou mot de passe incorrect");
} 
const token = Math.random().toString(36).substring(7);
tokens.push(token);
res.json({ token });
});
// Middleware pour vérifier le token
app.use((req, res, next) => {
const token = req.headers.authorization;
if (!token || !tokens.includes(token)) {
return res.status(403).send("Accès non autorisé");
}next();
});
app.listen(3000, () => {
console.log("Serveur démarré sur http://localhost:3000");
});