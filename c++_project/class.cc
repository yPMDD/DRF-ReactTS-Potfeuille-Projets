#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <ctime>

using namespace std;

// Classe Joueur
class Joueur {
private:
    static int compteurID;
    int id;
    string nom;
    int score;

public:
    Joueur(const string& nom, int score = 0) : id(++compteurID), nom(nom), score(score) {}

    int getId() const { return id; }
    string getNom() const { return nom; }
    int getScore() const { return score; }

    void setScore(int s) { score = s; }
};

int Joueur::compteurID = 0;

// Classe Terrain
class Terrain {
private:
    static int compteurID;
    int id;
    string nom;
    int capacite;

public:
    Terrain(const string& nom, int capacite) : id(++compteurID), nom(nom), capacite(capacite) {}

    int getId() const { return id; }
    string getNom() const { return nom; }
    int getCapacite() const { return capacite; }
};

int Terrain::compteurID = 0;

// Classe Match
class Match {
private:
    static int compteurID;
    int id;
    Joueur joueur1;
    Joueur joueur2;
    Terrain terrain;
    int score1;
    int score2;
    string phase;

public:
    Match(const Joueur& j1, const Joueur& j2, const Terrain& t, const string& phase)
        : id(++compteurID), joueur1(j1), joueur2(j2), terrain(t), score1(0), score2(0), phase(phase) {}

    int getId() const { return id; }
    Joueur getJoueur1() const { return joueur1; }
    Joueur getJoueur2() const { return joueur2; }
    Terrain getTerrain() const { return terrain; }
    string getPhase() const { return phase; }

    void setScore(int s1, int s2) {
        score1 = s1;
        score2 = s2;
    }

    bool isMatchFinished() const {
        return score1 != score2;
    }

    Joueur getWinner() const {
        return score1 > score2 ? joueur1 : joueur2;
    }
};

int Match::compteurID = 0;

// Classe Ticket
class Ticket {
private:
    static int compteurID;
    int id;
    Match match;
    string supporter;
    int quantite;
    double prix;

public:
    Ticket(const Match& m, const string& supporter, int quantite, double prix)
        : id(++compteurID), match(m), supporter(supporter), quantite(quantite), prix(prix) {}

    int getId() const { return id; }
    Match getMatch() const { return match; }
    string getSupporter() const { return supporter; }
    int getQuantite() const { return quantite; }
    double getPrix() const { return prix; }
};

int Ticket::compteurID = 0;

// Classe Championnat
class Championnat {
private:
    static int compteurID;
    int id;
    vector<Joueur> joueurs;
    vector<Terrain> terrains;
    vector<Match> matchs;
    vector<Ticket> tickets;
    vector<Joueur> joueursQualifies;

public:
    Championnat() : id(++compteurID) {}
    vector<Match> getmatchs()const{ return matchs;}
    void ajouterJoueur(const Joueur& joueur) {
        joueurs.push_back(joueur);
    }

    void ajouterTerrain(const Terrain& terrain) {
        terrains.push_back(terrain);
    }

    void ajouterMatch(const Match& match) {
        matchs.push_back(match);
    }

    void ajouterJoueurQualifie(const Joueur& joueur) {
        joueursQualifies.push_back(joueur);
    }

    void supprimerJoueur(int joueurId) {
        joueurs.erase(
            remove_if(joueurs.begin(), joueurs.end(),
                      [joueurId](const Joueur& j) { return j.getId() == joueurId; }),
            joueurs.end());
    }

    void supprimerTerrain(int terrainId) {
        terrains.erase(
            remove_if(terrains.begin(), terrains.end(),
                      [terrainId](const Terrain& t) { return t.getId() == terrainId; }),
            terrains.end());
    }

    void afficherJoueurs() const {
        for (const auto& joueur : joueurs) {
            cout << "Joueur ID: " << joueur.getId()
                 << ", Nom: " << joueur.getNom()
                 << ", Score: " << joueur.getScore() << endl;
        }
    }

    void afficherTerrains() const {
        for (const auto& terrain : terrains) {
            cout << "Terrain ID: " << terrain.getId()
                 << ", Nom: " << terrain.getNom()
                 << ", Capacité: " << terrain.getCapacite() << endl;
        }
    }

    void reserverTicket(const Match& match, const string& supporter, int quantite) {
        int capaciteDisponible = match.getTerrain().getCapacite();
        for (const auto& ticket : tickets) {
            if (ticket.getId() == match.getId()) {
                capaciteDisponible -= ticket.getQuantite();
            }
        }

        if (capaciteDisponible < quantite) {
            cout << "Erreur : Places insuffisantes pour ce match.\n";
            return;
        }

        double prix = 50.0; // Exemple de prix fixe par ticket
        tickets.emplace_back(match, supporter, quantite, prix);
        cout << "Réservation réussie ! Ticket ID : " << tickets.back().getId() << "\n";
    }

    void afficherTickets() const {
        for (const auto& ticket : tickets) {
            cout << "Ticket ID: " << ticket.getId()
                 << ", Match ID: " << ticket.getId()
                 << ", Supporter: " << ticket.getSupporter()
                 << ", Quantité: " << ticket.getQuantite()
                 << ", Prix: " << ticket.getPrix() << " EUR\n";
        }
    }

    // Méthode pour planifier les matchs
    void planifierPhases() {
        srand(time(0)); // Initialiser le générateur de nombres aléatoires

        vector<Joueur> joueursRestants = joueurs;

        cout << "Phase Éliminatoire :\n";
        while (joueursRestants.size() > 1) {
            random_shuffle(joueursRestants.begin(), joueursRestants.end()); // Mélanger les joueurs
            for (size_t i = 0; i < joueursRestants.size(); i += 2) {
                if (i + 1 < joueursRestants.size()) {
                    // Assigner un match entre deux joueurs
                    Joueur joueur1 = joueursRestants[i];
                    Joueur joueur2 = joueursRestants[i + 1];
                    Terrain terrain = terrains[rand() % terrains.size()]; // Choisir un terrain aléatoire
                    Match match(joueur1, joueur2, terrain, "Éliminatoire");
                    matchs.push_back(match);

                    // Simuler un score (ici aléatoire)
                    int score1 = rand() % 7;  // Score aléatoire entre 0 et 6
                    int score2 = rand() % 7;  // Score aléatoire entre 0 et 6
                    matchs.back().setScore(score1, score2);

                    // Déterminer le gagnant
                    Joueur gagnant = matchs.back().getWinner();
                    joueursRestants.push_back(gagnant);  // Ajouter le gagnant pour la prochaine phase
                    cout << "Match: " << joueur1.getNom() << " vs " << joueur2.getNom() << " - Vainqueur: " << gagnant.getNom() << endl;
                }
            }
            joueursRestants.resize(joueursRestants.size() / 2); // Réduire le nombre de joueurs pour la prochaine phase
        }
        cout << "Champion: " << joueursRestants[0].getNom() << endl;
    }
};

int Championnat::compteurID = 0;

int main() {
    Championnat championnat;
    int choix;

    do {
        cout << "\n===== MENU =====\n";
        cout << "1. Commencer un championnat\n";
        cout << "2. Ajouter un joueur\n";
        cout << "3. Ajouter un terrain\n";
        cout << "4. Supprimer un joueur\n";
        cout << "5. Supprimer un terrain\n";
        cout << "6. Afficher tous les joueurs\n";
        cout << "7. Afficher tous les terrains\n";
        cout << "8. Créer des matchs\n";
        cout << "9. Réserver des tickets\n";
        cout << "10. Afficher les résultats\n";
        cout << "11. Planifier les parties (Phase Éliminatoire)\n";
        cout << "12. Quitter\n";
        cout << "Votre choix : ";
        cin >> choix;

        switch (choix) {
            case 1: {
                cout << "Un nouveau championnat a été démarré !\n";
                championnat = Championnat(); // Réinitialiser le championnat
                break;
            }
            case 2: {
                string nom;
                cout << "Entrez le nom du joueur : ";
                cin >> nom;
                championnat.ajouterJoueur(Joueur(nom));
                cout << "Joueur ajouté : " << nom << endl;
                break;
            }
            case 3: {
                string nom;
                int capacite;
                cout << "Entrez le nom du terrain : ";
                cin >> nom;
                cout << "Entrez la capacité du terrain : ";
                cin >> capacite;
                championnat.ajouterTerrain(Terrain(nom, capacite));
                cout << "Terrain ajouté : " << nom << endl;
                break;
            }
            case 4: {
                int id;
                cout << "Entrez l'ID du joueur à supprimer : ";
                cin >> id;
                championnat.supprimerJoueur(id);
                cout << "Joueur supprimé.\n";
                break;
            }
            case 5: {
                int id;
                cout << "Entrez l'ID du terrain à supprimer : ";
                cin >> id;
                championnat.supprimerTerrain(id);
                cout << "Terrain supprimé.\n";
                break;
            }
            case 6: {
                championnat.afficherJoueurs();
                break;
            }
            case 7: {
                championnat.afficherTerrains();
                break;
            }
            case 8: {
                // Créer des matchs (à personnaliser)
                break;
            }
            case 9: {
                int matchId, quantite;
                string supporter;
                cout << "Entrez l'ID du match : ";
                cin >> matchId;
                cout << "Entrez votre nom : ";
                cin >> supporter;
                cout << "Entrez la quantité de tickets : ";
                cin >> quantite;
                // Exemple pour réserver des tickets
                Match match = championnat.getmatchs()[matchId-1];  // Recherche du match par ID
                championnat.reserverTicket(match, supporter, quantite);
                break;
            }
            case 10: {
                championnat.afficherTickets();
                break;
            }
            case 11: {
                championnat.planifierPhases();
                break;
            }
            case 12: {
                cout << "Au revoir !\n";
                break;
            }
            default:
                cout << "Choix invalide. Veuillez réessayer.\n";
        }
    } while (choix != 12);

    return 0;
}
