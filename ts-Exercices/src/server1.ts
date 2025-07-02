import express from "express";
const app = express();
// Définir une route GET pour "/" 
app.get("/", (req, res) => {
res.send("Bienvenue sur votre serveur Node.js avec TypeScript !");
});
// Démarrer le serveur sur le port 3000
app.listen(3000, () => { 
    console.log("Serveur démarré sur http://localhost:3000"); });