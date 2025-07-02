import express from "express";
const app = express();
app.use(express.json());

app.get("/error", (req, res) => {
    throw new Error("Erreur simulée !");
  })
// Route inexistante
app.use((req, res, next) => {
res.status(404).send("Route non trouvée");
});
// Middleware global pour gérer les erreurs
app.use((err:any, req:any, res:any, next:any) => {
console.error(err.stack);
res.status(500).send("Une erreur interne est survenue");
});
app.listen(3000, () => {
console.log("Serveur démarré sur http://localhost:3000");
});