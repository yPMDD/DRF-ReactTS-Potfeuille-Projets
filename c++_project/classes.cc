#include<iostream>
#include<vector>
#include<algorithm>
#include<string>
using namespace std;

class Joueur {
private:
    int id;
    string nom;
    int score;
    static int cmpt;
public:
    Joueur() : id(0), nom(""), score(0) {};
    Joueur(const string& n, int sc):id(cmpt++),nom(n),score(sc){};
    int getId() const{
        return id;
    };
    void setNom(string n){
        nom=n;
    }
    string getNom() const{
        return nom;
    };
    int getScore() const{
        return score;
    };
    void setScore(int nouveauScore){
        score = nouveauScore;
    };
};
int Joueur::cmpt(0);



class Terrain {
private:
    int id;
    string nom;
    int capacite;
    static int cmpt;
public:
    Terrain() : id(0), nom(""), capacite(0) {};
    Terrain(const string& n, int cap):id(cmpt++),nom(n),capacite(cap){};
    int getId() const{
        return id ;
    };
    void setNom(string n){
        nom=n;
    }
    string getNom() const{
        return nom;
    };
    void setCapacite(int cap){
        capacite=cap;
    }
    int getCapacite() const{
        return capacite;
    };
};
int Terrain::cmpt(0);



class Match {
private:
    int id;
    Joueur joueur1;
    Joueur joueur2;
    Terrain terrain;
    static int cmpt;
public:
    Match(const Joueur& joueur1, const Joueur& joueur2, const Terrain& terrain):id(cmpt++){};
    void setScores(int score1, int score2){
        joueur1.setScore(score1);
        joueur2.setScore(score2);
    };
    Joueur getVainqueur() const{
        return (joueur1.getScore() > joueur2.getScore()) ? joueur1 : joueur2;
    };
};
int Match::cmpt(0);

class tickets{
    private:
        int id;
        Terrain terrain;
        double prix;
        static int cmpt;
    public:
        tickets(const Terrain& t,double p):terrain(t),prix(p){cmpt++;}
        void setPrix(double p){
            prix=p;
        }
        double getPrix()const{
            return prix;
        }      

};
int tickets::cmpt(0);

class tournament{
    private:
        vector<Terrain>terrains;
        vector<Joueur>joueurs;
        

    public:
    tournament(){};
    void ajouterjoueur(Joueur joueur){
        joueurs.push_back(joueur);
    }
    void supprimerjoueur(Joueur joueur){
        for(auto i = joueurs.begin();i!=joueurs.end();++i){
            if(*i == joueur){
                joueurs.erase(i);break;
            }
        }
    }
    
};








