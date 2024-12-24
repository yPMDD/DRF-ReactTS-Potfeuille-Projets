#include <iostream>
#include <vector>
#include <string>
#include <cstdlib>
#include <algorithm>
using namespace std;


class Joueur {
private:
    int id;
    string nom;
    int score;

public:
    Joueur(int id, string nom, int score) : id(id), nom(nom), score(score) {}

    int getId() const {
        return id;
    }

    string getNom() const {
        return nom;
    }

    int getScore() const {
        return score;
    }

    void afficherInfo() const {
        cout << "ID: " << id << ", Nom: " << nom << ", Score: " << score << endl;
    }
};

class Terrain {
private:
    string nom;
    int capacite;

public:
    Terrain(string nom, int capacite) : nom(nom), capacite(capacite) {}

    string getNom() const {
        return nom;
    }

    int getCapacite() const {
        return capacite;
    }

    void decrementerCapacite() {
        if (capacite > 0) {
            capacite--;
        }
    }
};

class GestionTerrain {
private:
    vector<Terrain> terrains;

public:
    void ajouterTerrain(const Terrain& terrain) {
        terrains.push_back(terrain);
    }

    void supprimerTerrain(int index) {
        if (index >= 0 && index < terrains.size()) {
            terrains.erase(terrains.begin() + index);
            cout << "Terrain supprimé avec succès." << endl;
        } else {
            cout << "Terrain introuvable." << endl;
        }
    }

    Terrain& rechercherTerrain(const string nom) {
        for (auto& terrain : terrains) {
            if (terrain.getNom() == nom) {
                return terrain;
            }

        }
        throw runtime_error("Terrain non trouvé.");
    }

    void afficherTousLesTerrains() const {
        if (terrains.empty()) {
            cout << "Aucun terrain disponible." << endl;
        } else {
            for (const auto& terrain : terrains) {
                cout << "Terrain : " << terrain.getNom() << ", Capacité : " << terrain.getCapacite() << endl;
            }
        }
    }

    int getNbTerrains() const {
        return terrains.size();
    }

    Terrain& getTerrainAleatoire() {
        if (terrains.empty()) {
            throw runtime_error("Aucun terrain disponible pour sélectionner un terrain aléatoire.");
        }

        int index = rand() % terrains.size();
        return terrains[index];
    }
};


class GestionJoueurs {
private:
    vector<Joueur> joueurs;
     int id=1;
public:
    void ajouterJoueur(const string& nom) {
        int score = rand() % 101;
        joueurs.push_back(Joueur(id++, nom, score));
    }

    void supprimerJoueur(int id) {
        auto it = find_if(joueurs.begin(), joueurs.end(), [id](const Joueur& j) {
            return j.getId() == id;
        });
        if (it != joueurs.end()) {
            joueurs.erase(it);
            cout << "Joueur supprimé avec succès." << endl;
        } else {
            cout << "Joueur introuvable." << endl;
        }
    }

    Joueur* rechercherJoueur(int id) {
        for (auto& joueur : joueurs) {
            if (joueur.getId() == id) {
                cout << "Joueur trouvé :\n";
                joueur.afficherInfo();
                return &joueur;
            }
        }
        cout << "Joueur non trouvé !" << endl;
        return nullptr;
    }

    void afficherTousLesJoueurs() const {
        if (joueurs.empty()) {
            cout << "Aucun joueur disponible." << endl;
        } else {
            for (const auto& joueur : joueurs) {
                joueur.afficherInfo();
            }
        }
    }

    int getNbJoueurs() const {
        return joueurs.size();
    }
    vector<Joueur>& getJoueurs() {
        return joueurs;
    }
};

class Ticket {
private:
    double prix;
    string phase;
    Terrain& terrain;

public:
    Ticket(string phase, Terrain& terrain) : phase(phase), terrain(terrain) {
        if (phase == "Huitièmes") {
            prix = 50;
        } else if (phase == "Quarts") {
            prix = 75 ;
        } else if (phase == "Demi-finales") {
            prix = 100 ;
        } else if (phase == "Finale") {
            prix = 150 ;
        }
    }

    double getPrix() const {
        return prix;
    }

    void afficherTicket() const {
        cout << "Terrain: " << terrain.getNom() << ", Prix du ticket: " << prix << endl;
    }

     bool reserver() {
        if (terrain.getCapacite() > 0) {
            terrain.decrementerCapacite();
            cout << "Ticket réservé avec succès pour " << phase << ". Prix: " << prix << ".\n";
            return true;
        }
        cout << "Désolé, il n'y a plus de place pour cette phase.\n";
        return false;
    }
};


class Planification {
public:
    void planifierTournoi(GestionJoueurs& gestionJoueurs, GestionTerrain& gestionTerrain) {
        vector<Joueur>& joueurs = gestionJoueurs.getJoueurs();


        if (joueurs.size() != 2 && joueurs.size() != 4 && joueurs.size() != 8 && joueurs.size() != 16) {
            cout << "Le tournoi nécessite 2, 4, 8 ou 16 joueurs pour démarrer.\n";
            return;
        }


        string phases[] = {"Huitièmes", "Quarts", "Demi-finales", "Finale"};
        int phaseIndex = 0;

        if (joueurs.size() == 16) {
            phaseIndex = 0;
        } else if (joueurs.size() == 8) {
            phaseIndex = 1;
        } else if (joueurs.size() == 4) {
            phaseIndex = 2;
        } else if (joueurs.size() == 2) {
            phaseIndex = 3;
        }

        for (int i = phaseIndex; i < 4; ++i) {
            cout << "\nPhase : " << phases[i] << endl;
            creerParties(joueurs, gestionTerrain, phases[i]);

            if (joueurs.size() == 1) {
                cout << "\nLe grand vainqueur est : " << joueurs[0].getNom() << " avec un score de " << joueurs[0].getScore() << " !" << endl;
                break;
            }
        }
    }

private:
    void creerParties(vector<Joueur>& joueurs, GestionTerrain& gestionTerrain, string phase) {
        random_shuffle(joueurs.begin(), joueurs.end());

        vector<Joueur> vainqueurs;
        for (size_t i = 0; i < joueurs.size(); i += 2) {
            if (i + 1 < joueurs.size()) {
                Joueur& joueur1 = joueurs[i];
                Joueur& joueur2 = joueurs[i + 1];

                cout << "Match : " << joueur1.getNom() << " vs " << joueur2.getNom() << endl;

                Terrain& terrain = gestionTerrain.getTerrainAleatoire();
                Ticket ticket(phase, terrain);
                ticket.afficherTicket();

                if (joueur1.getScore() >= joueur2.getScore()) {
                    cout << "Vainqueur : " << joueur1.getNom() << endl;
                    vainqueurs.push_back(joueur1);
                } else {
                    cout << "Vainqueur : " << joueur2.getNom() << endl;
                    vainqueurs.push_back(joueur2);
                }
            }
        }

        joueurs = vainqueurs;
    }
};


int main() {


    GestionTerrain gestionTerrain;
    GestionJoueurs gestionJoueurs;
    Planification planification;

    int choix;
    do {
        cout << "\nMenu :\n";
        cout << "1. Ajouter un joueur\n";
        cout << "2. Supprimer un joueur\n";
        cout << "3. Afficher tous les joueurs\n";
        cout << "4. Ajouter un terrain\n";
        cout << "5. Supprimer un terrain\n";
        cout << "6. Afficher tous les terrains\n";
        cout << "7. Rechercher un joueur\n";
        cout << "8. Rechercher un terrain\n";
        cout << "9. Planifier le tournoi\n";
        cout << "10. Acheter un ticket\n";
        cout << "11. Quitter\n";
        cout << "Choisissez une option : ";
        cin >> choix;

        switch (choix) {
            case 1: {
    string nom;
    cout << "Entrez le nom du joueur : ";
    cin >> nom;
    gestionJoueurs.ajouterJoueur(nom);
    break;
}
            case 2: {
                int id;
                cout << "Entrez l'ID du joueur à supprimer : ";
                cin >> id;
                gestionJoueurs.supprimerJoueur(id);
                break;
            }
            case 3: {
                gestionJoueurs.afficherTousLesJoueurs();
                break;
            }
            case 4: {
                string nomTerrain;
                int capacite;
                cout << "Entrez le nom du terrain : ";
                cin >> nomTerrain;
                cout << "Entrez la capacité du terrain : ";
                cin >> capacite;
                gestionTerrain.ajouterTerrain(Terrain(nomTerrain, capacite));
                break;
            }
            case 5: {
                int index;
                cout << "Entrez l'indice du terrain à supprimer : ";
                cin >> index;
                gestionTerrain.supprimerTerrain(index);
                break;
            }
            case 6: {
                gestionTerrain.afficherTousLesTerrains();
                break;
            }
            case 7: {
                int id;
                cout << "Entrez l'ID du joueur à rechercher : ";
                cin >> id;
                gestionJoueurs.rechercherJoueur(id);
                break;
            }
            case 8: {
                string nomTerrain;
                cout << "Entrez le nom du terrain à rechercher : ";
                cin >> nomTerrain;
                try {
                    Terrain& terrain = gestionTerrain.rechercherTerrain(nomTerrain);
                    cout << "Terrain trouvé : " << terrain.getNom() << ", Capacité : " << terrain.getCapacite() << endl;
                } catch (const exception& e) {
                    cout << e.what() << endl;
                }
                break;
            }
            case 9: {
                planification.planifierTournoi(gestionJoueurs, gestionTerrain);
                break;
            }
            case 10: {
                string nomJoueur, nomTerrain, phase;
                cout << "Entrez votre nom : ";
                cin >> nomJoueur;
                cout << "Entrez la phase (Huitièmes, Quarts, Demi-finales, Finale) : ";
                cin >> phase;
                cout << "Entrez le nom du terrain : ";
                cin >> nomTerrain;


                        Terrain& terrain = gestionTerrain.rechercherTerrain(nomTerrain);
                        Ticket ticket(phase, terrain);
                        ticket.afficherTicket();


                        if (ticket.reserver()) {
                            cout << "Ticket acheté avec succès pour " << nomJoueur << " à " << nomTerrain << ". Prix du ticket: " << ticket.getPrix() << " euros.\n";
                        } else {
                            cout << "Impossible d'acheter le ticket, terrain complet.\n";
                        }

                break;
            }
            case 11: {
                cout << "Au revoir !" << endl;
                break;
            }
            default:
                cout << "Option invalide, veuillez réessayer." << endl;
        }
    } while (choix != 11);

    return 0;
}
