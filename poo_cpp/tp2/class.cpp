#include <iostream>
#include<vector>
using namespace std;
#include <limits>
#include <climits>
class ville {
    private :
    int code;
    string nom;
    int jours;

public : 
    ville(int c, string n, int j):code(c), nom(n), jours(j){}
    void aff(){
        cout << "code :" << code<<endl;
        cout << "ville :" << nom << endl;
        cout << "nombre de jours" << jours <<endl; 
    }

    void saisie (){
        cout << "saisir le code de la ville : "<<endl ;
        cin >> code;
        cout << "saisir le nom de la ville :" <<endl;
        cin >> nom;
        cout << "saisir le nombre de jours du sejour : "<<endl;
        cin >> jours;
    }
    string getnom(){return nom ;}

    int getcode(){
        return code;
    }
    int getjours(){
        return jours;
    }

     int compare(ville v){
        if(code==v.code){
            return 1;
        }
        else
        return 0;
     }

};

class circuit{
    private :
    string nom;
    int nombre;
    vector<ville> villes;

public : 

circuit (string n, vector<ville> tab) : nom(n), villes(tab){
    if(tab.size() > 7){
        tab.resize(7);
        nombre=7;
    }
    else{
        nombre= tab.size();
    }
}
int verif(ville v){
     for (int i=0;i<villes.size();i++){
          if(v.getcode()==villes[i].getcode()){
            return 1;
          }
     }
     return 0;
}

void ajout(ville v){
         v.saisie();
         if(villes.size()<7)
        villes.push_back(v);
         else
         cout <<"le circuit est a son maximum de villes";
}

int total() {
    int sum = 0;
    for ( auto& v : villes) {
        sum += v.getjours();
    }
    return sum;
}

void retirer(ville v){
    if(verif(v)==0){
        cout<<"la ville n'existe pas";
    }
    else{
        for(int i=0; i<villes.size();i++){
            if(villes[i].compare(v)==1){
                villes.erase(villes.begin()+i);
            }
        }
    }
}
 ville getLastVille() const {
        if (!villes.empty())
            return villes.back();
        else cout<<"no villes in the circuit";
        }
        

void affichercircuit(){
    cout << "le nom du circuit est" << nom<< endl;
    for(int i=0; i<villes.size();i++){
        cout<<villes[i].getnom()<<endl;
        cout<<villes[i].getjours()<<endl;
    }
}

circuit circuitcommun(circuit c){
    vector<ville> tab;
    for(int i=0; i<villes.size();i++){
        for(int j=0; j<c.villes.size();j++){
            if(villes[i].compare(c.villes[j])==1){
              tab.push_back(villes[i]);
            }
        }
    }
    circuit c_coummun("circuit_commun", tab);
    return c_coummun;
}


};

circuit circuitmin(vector<circuit>& tab) {

    circuit* circuit_min = &tab[0];
    int duree_min = tab[0].total();

    for (auto& c : tab) {
        int duree = c.total();
        if (duree < duree_min) {
            duree_min = duree;
            circuit_min = &c;
        }
    }
    return *circuit_min; 
}



