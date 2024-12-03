#include <iostream>
#include <vector>
#include <string>
using namespace std;

/*******************************************
 * Completez le programme a partir d'ici.
 *******************************************/
// Chaines de caractÃ¨res Ã  utiliser pour les affichages:
/*

Ã©tÃ© jetÃ©

d'un

n'est

L'oeuvre

bibliothÃ¨que

dÃ©truit

*/

class Auteur{
    private:
        string name;
        bool awarded;
    public:
        Auteur(string n,bool a): name(n), awarded(a){};
        string getNom(){
            return name;
        }
        bool getPrix(){
            return awarded;
        }
};

class Oeuvre{
    private:
        string title;
        Auteur author;
        string lang;
    public:
        Oeuvre(string t , Auteur a , string l):
        title(t),
        author(a),
        lang(l){};
        
        ~Oeuvre(){
            cout << "L'oeuvre \""<< title 
            << ", " << author.getNom() << ", "
            << "en " << lang << "\" n'est plus disponible." 
            << endl;
        }

        string getTitle(){return title;}
        Auteur getAuteur(){return author;}
        string getLang(){return lang;}
        void affiche(){
            cout << title << ", " << author.getNom() 
            << ", "<< "en " << lang << endl;
        }
};  

class Exemplaire{
    private:
        Oeuvre const& copy;
    public:
        Exemplaire(const Oeuvre& a):copy(a){
        cout << "Nouvel exemplaire de : " << copy.getTitle()<< ", " 
        << copy.getAuteur().getNom() << ", en "<< copy.getLang() << endl; 
         };
        Exemplaire(Exemplaire const& cop):copy(cop.copy){}
};
class Bibliotheque{

};
/*******************************************
 * Ne rien modifier apres cette ligne.
 *******************************************/

int main()
{
  Auteur a1("Victor Hugo"),
         a2("Alexandre Dumas"),
         a3("Raymond Queneau", true);

  Oeuvre o1("Les Misérables"           , a1, "français" ),
         o2("L'Homme qui rit"          , a1, "français" ),
         o3("Le Comte de Monte-Cristo" , a2, "français" ),
         o4("Zazie dans le métro"      , a3, "français" ),
         o5("The Count of Monte-Cristo", a2, "anglais" );

  Bibliotheque biblio("municipale");
  biblio.stocker(o1, 2);
  biblio.stocker(o2);
  biblio.stocker(o3, 3);
  biblio.stocker(o4);
  biblio.stocker(o5);

  cout << "La bibliothèque " << biblio.getNom()
       << " offre les exemplaires suivants :" << endl;
  biblio.lister_exemplaires();

  const string langue("anglais");
  cout << " Les exemplaires en "<< langue << " sont :" << endl;
  biblio.lister_exemplaires(langue);

  cout << " Les auteurs à succès sont :" << endl;
  biblio.afficher_auteurs(true);

  cout << " Il y a " << biblio.compter_exemplaires(o3) << " exemplaires de "
       << o3.getTitre() << endl;

  return 0;
}