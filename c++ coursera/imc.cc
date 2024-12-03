#include <iostream>
using namespace std;

class Patient {
    private : 
        double masse;
        double hauteur;
    public :
        void init(double weight, double height){
            if(weight>0 && height > 0){
                masse = weight;
                hauteur = height;
            }
            else{
               masse = 0;
                hauteur = 0;
            }
        }
        void afficher(){
            cout << "Patient : " << masse << " kg pour " 
                 << hauteur << " m "<< endl; 
        }
        double poids()const{
            return masse;
        }
        double taille()const{
            return hauteur;
        }
        double imc(){
            if(hauteur==0){
                return 0;
            }
            else { return masse / (hauteur * hauteur) ;}
        }

};

/*******************************************
 * Ne rien modifier après cette ligne.
 *******************************************/

int main()
{
  Patient quidam;
  double poids, taille;
  do {
    cout << "Entrez un poids (kg) et une taille (m) : ";
    cin >> poids >> taille;
    quidam.init(poids, taille);
    quidam.afficher();
    cout << "IMC : " << quidam.imc() << endl;
  } while (poids * taille != 0.0);
  return 0;
}
