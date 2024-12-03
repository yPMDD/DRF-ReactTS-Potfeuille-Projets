#include<iostream>
using namespace std;

class etudiant {
    private:
        string nom;
        float n1, n2 ;
    public:
        etudiant(const std::string& nom, float note1, float note2) 
        : nom(nom), n1(note1), n2(note2) {}
        float calc_moy(){
            return (n1 + n2) / 2 ;
        }
        void affich(string nom){
            
            cout << nom << " -> " << calc_moy() ;
        }
};
