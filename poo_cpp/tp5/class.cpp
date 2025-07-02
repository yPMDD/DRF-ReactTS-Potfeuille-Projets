#include<iostream>
#include<vector>
#include<string>

using namespace std;


class document {
    private:
        int id;
        string titre;
        double prix;
        static int cmpt;
    public:
        
        document(string t,double p):titre(t),prix(p){ 
            id=cmpt++;
            }
        
        virtual ~document() {}
        //setters getters
        int getId()const{return id;}
        void setId(int i){id=i;}
        string getTitre()const{ return titre; }
        void setTitre(string t){ titre=t; }
        double getPrix()const{return prix;}
        void setPrix(double p){prix=p;}
        bool operator==(const document& other)const{
            return id==other.id;
        }

        bool operator<(const document& other)const{
            return prix<other.prix;
        }
        void solder(double prcntg){
            if(prcntg>0 && prcntg <=100){
                prix -= (prix * prcntg / 100);
            }
        }
        friend ostream& operator<<( ostream& os, const document& doc) {
        os << "ID: " << doc.id << ", Titre: " << doc.titre;
        return os;
        }
        
        virtual void afficherDetails( ostream& os) const {
        os << "ID: " << id << ", Titre: " << titre << ", Prix: " << prix;
        }
};
int document::cmpt(1);
class Livre : public document {
    
private:
    string auteur;
    int  nbrpag;

public:
    Livre() : document("", 0.0), auteur(""), nbrpag(0) {}
    Livre(const  string& titre, double prix, const  string& auteur, int  nbrpag)
        : document(titre, prix), auteur(auteur),  nbrpag( nbrpag) {}

    // Overridden display function
    void afficherDetails( ostream& os) const override {
        document::afficherDetails(os);
        os << ", Auteur: " << auteur << ", Pages: " <<  nbrpag;
    }

    // Overload output operator
    friend  ostream& operator<<( ostream& os, const Livre& livre) {
        os << "ID: " << livre.getId() << " ";
        os << livre.getTitre() << " ";
        os << livre.auteur << " " << livre. nbrpag << " pages";
        return os;
    }
    using document::getTitre;  
    using document::getId;    
    using document::getPrix;  
};


class Dictionnaire : private document {
    private:
    std::string langue;
    int nbrtom;

public:
    // Constructor
    Dictionnaire(const std::string& titre, double prix, const std::string& langue, int nbr)
        : document(titre, prix), langue(langue), nbrtom(nbr) {}

     // Overridden display function
    void afficherDetails(std::ostream& os) const {
        document::afficherDetails(os);
        os << ", Langue: " << langue << ", Tomes: " << nbrtom;
    }

    // Overload output operator
    friend std::ostream& operator<<(std::ostream& os, const Dictionnaire& dict) {
        os << "ID: " << dict.getId() << " ";
        os << dict.getTitre() << " ";
        os << dict.langue << " " << dict.nbrtom << " tomes";
        return os;
    }

    using document::getTitre; 
    using document::getId;   
    using document::getPrix; 
        
};

class CollectionLivre {
private:
    Livre* CL;      
    char* Res;      
    int taille;     
    int nl;         

public:
   
    CollectionLivre(int taille)
        : taille(taille), nl(0) {
        CL = new Livre[taille];
        Res = new char[taille];
        for (int i = 0; i < taille; ++i) {
            Res[i] = 'L'; 
        }
    }
    
    ~CollectionLivre() {
        delete[] CL;
        delete[] Res;
    }

    bool verifierCode(int code) const {
        for (int i = 0; i < nl; ++i) {
            if (CL[i].getId() == code) {
                return true;
            }
        }
        return false;
    }

    
    bool verifierLivre(const Livre& livre) const {
        for (int i = 0; i < nl; ++i) {
            if (CL[i] == livre) {
                return true;
            }
        }
        return false;
    }

    
    bool Ajouter(const Livre& livre) {
        if (nl >= taille) {
            return false; 
        }
        CL[nl] = livre;
        Res[nl] = 'L'; 
        ++nl;
        return true;
    }

    Livre* Rechercher(int code) {
        for (int i = 0; i < nl; ++i) {
            if (CL[i].getId() == code) {
                return &CL[i];
            }
        }
        return nullptr;
    }

    bool Reserver(int code) {
        for (int i = 0; i < nl; ++i) {
            if (CL[i].getId() == code && Res[i] == 'L') {
                Res[i] = 'R'; 
                return true;
            }
        }
        return false; 
    }

    
    friend ostream& operator<<(ostream& os, const CollectionLivre& collection) {
        for (int i = 0; i < collection.nl; ++i) {
            os << collection.CL[i] ;
            os << " ==> " << collection.Res[i] << "\n";
        }
        return os;
    }
};

int main() {
    
    document doc1("Introduction to C++", 29.99);
   

    cout << "Testing document class:\n";
    cout << doc1 << "\n";
   

    doc1.solder(10); 
    cout << "After discount, doc1 price: " << doc1.getPrix() << "\n\n";

    
    Livre livre1("The Great Gatsby", 15.99, "F. Scott Fitzgerald", 180);
    Livre livre2("1984", 12.99, "George Orwell", 328);

    cout << "Testing Livre class:\n";
    cout << livre1 << "\n";
    cout << livre2 << "\n\n";

    
    Dictionnaire dict1("Oxford English Dictionary", 99.99, "English", 20);
    Dictionnaire dict2("Larousse Français", 79.99, "French", 10);

    cout << "Testing Dictionnaire class:\n";
    cout << dict1 << "\n";
    cout << dict2 << "\n\n";

    
    CollectionLivre collection(5);

    cout << "Testing CollectionLivre class:\n";
    cout << "Adding livres to the collection:\n";
    collection.Ajouter(livre1);
    collection.Ajouter(livre2);

    cout << "Collection contents:\n";
    cout << collection << "\n";

    cout << "Reserving livre with ID 1:\n";
    if (collection.Reserver(2)) {
        cout << "Reservation successful!\n";
    } else {
        cout << "Reservation failed (book not found or already reserved).\n";
    }

    cout << "Collection contents after reservation:\n";
    cout << collection << "\n";

    cout << "Searching for livre with ID 2:\n";
    Livre* found = collection.Rechercher(2);
    if (found) {
        cout << "Found livre:\n" << *found << "\n";
    } else {
        cout << "Livre not found.\n";
    }

    cout << "Checking if livre with ID 3 exists:\n";
    if (collection.verifierCode(3)) {
        cout << "Livre exists in the collection.\n";
    } else {
        cout << "Livre does not exist in the collection.\n";
    }

    return 0;
}

