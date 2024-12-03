#include "class.cpp";

int main() {
    
    vector<ville> villes1 = {ville(1, "Meknes", 3), ville(2, "Fes", 2), ville(3, "Rabat", 4)};
    vector<ville> villes2 = {ville(4, "Marrakesh", 2), ville(5, "Tanger", 3), ville(6, "Sale", 5)};
    vector<ville> villes3 = {ville(7, "Tetouan", 4), ville(8, "oujda", 3)};
    vector<ville> villes4 = {ville(9, "chefchaouen", 2), ville(10, "errachidia", 3), ville(11, "bni mellalù", 1)};
    
    circuit c1("Circuit 1", villes1);
    circuit c2("Circuit 2", villes2);
    circuit c3("Circuit 3", villes3);
    circuit c4("Circuit 4", villes4);
    
    vector<circuit> circuits = {c1, c2, c3, c4};
    
    circuit c_min = circuitmin(circuits);
    cout << "Le circuit avec la durée la plus courte est : " << endl;
    c_min.affichercircuit();
    
    ville ville_to_remove = c_min.getLastVille();  
    c_min.retirer(ville_to_remove);
    c_min.affichercircuit();

    
    circuit c_commun = c1.circuitcommun(c_min);
    c_commun.affichercircuit();

    return 0;
}