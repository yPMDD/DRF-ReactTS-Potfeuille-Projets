const mysql = require("mysql2");

// Configurer la connexion MySQL
const db = mysql.createConnection({
  host: "localhost",      // Adresse du serveur MySQL (WAMP)
  user: "root",           // Nom d'utilisateur MySQL par défaut
  password: "",           // Laissez vide si vous n'avez pas défini de mot de passe
  database: "testDb",     // Nom de la base de données
});

// Tester la connexion
db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à MySQL :", err.message);
    return;
  }
  console.log("Connecté à MySQL via WAMP Server !");
});

// Exemple d'insertion de données
const name = "Fatima Zahra";
const email = "fati@example.com";

db.query(
  "INSERT INTO users (name, email) VALUES (?, ?)",
  [name, email],
  (err, results) => {
    if (err) {
      console.error("Erreur lors de l'insertion :", err.message);
      return;
    }
    console.log("Utilisateur ajouté avec succès !", results);
  }
);

// Fermer la connexion après les requêtes
db.end();
