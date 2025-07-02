#include <iostream>
#include <string>
#include <vector>
using namespace std;
class Document {
private:
    static int nextId; // Static variable to keep track of the next unique ID
    int id;           // Unique ID for the document
    string titre;
    double prix;

public:
    // Constructor
    Document(const string& titre, double prix) : titre(titre), prix(prix) {
        id = nextId++;
    }

    // Virtual destructor for polymorphic behavior
    virtual ~Document() {}

    // Accessors
    int getId() const {
        return id;
    }

    string getTitre() const {
        return titre;
    }

    double getPrix() const {
        return prix;
    }

    void setPrix(double nouveauPrix) {
        prix = nouveauPrix;
    }

    // Overload equality operator
    bool operator==(const Document& other) const {
        return id == other.id;
    }

    // Overload less-than operator
    bool operator<(const Document& other) const {
        return prix < other.prix;
    }

    // Apply a discount to the price
    void Solder(double pourcentage) {
        if (pourcentage > 0 && pourcentage <= 100) {
            prix -= (prix * pourcentage / 100);
        }
    }

    // Overload output operator
    friend ostream& operator<<(ostream& os, const Document& doc) {
        os << "ID: " << doc.id << ", Titre: " << doc.titre;
        return os;
    }

    // Pure virtual function for display
    virtual void afficherDetails(ostream& os) const {
        os << "ID: " << id << ", Titre: " << titre << ", Prix: " << prix;
    }
};

// Initialize the static member
int Document::nextId = 1;

class Livre : public Document {
private:
    string auteur;
    int nombreDePages;

public:
    // Constructor
    Livre(const string& titre, double prix, const string& auteur, int nombreDePages)
        : Document(titre, prix), auteur(auteur), nombreDePages(nombreDePages) {}

    // Overridden display function
    void afficherDetails(ostream& os) const override {
        Document::afficherDetails(os);
        os << ", Auteur: " << auteur << ", Pages: " << nombreDePages;
    }

    // Overload output operator
    friend ostream& operator<<(ostream& os, const Livre& livre) {
        os << "ID: " << livre.getId() << "\n";
        os << livre.getTitre() << "\n";
        os << livre.auteur << " " << livre.nombreDePages << " pages";
        return os;
    }
};

class Dictionnaire : private Document {
private:
    string langue;
    int nombreDeTomes;

public:
    // Constructor
    Dictionnaire(const string& titre, double prix, const string& langue, int nombreDeTomes)
        : Document(titre, prix), langue(langue), nombreDeTomes(nombreDeTomes) {}

    // Overridden display function
    void afficherDetails(ostream& os) const {
        Document::afficherDetails(os);
        os << ", Langue: " << langue << ", Tomes: " << nombreDeTomes;
    }

    // Overload output operator
    friend ostream& operator<<(ostream& os, const Dictionnaire& dict) {
        os << "ID: " << dict.getId() << "\n";
        os << dict.getTitre() << "\n";
        os << dict.langue << " " << dict.nombreDeTomes << " tomes";
        return os;
    }
    Document* toDocument() {
        return static_cast<Document*>(this);
    }

    using Document::getTitre; 
    using Document::getId;   
    using Document::getPrix; 
};

int main() {
    vector<Document*> bibliotheque;

    // Add various documents to the library
    bibliotheque.push_back(new Livre("Introduction to C++", 200, "Bjarne Stroustrup", 300));
    bibliotheque.push_back( new Dictionnaire("Larousse", 150, "Français", 2));

    // Display details of all documents
    for (const auto& doc : bibliotheque) {
        doc->afficherDetails(cout);
        cout << endl;
    }

    // Clean up dynamically allocated memory
    for (auto& doc : bibliotheque) {
        delete doc;
    }

    // Test << operators
    Livre livre("PHP Avancée", 120, "Eric Daspet", 34);
    Dictionnaire dict("Oxford", 180, "Anglais", 3);

    cout << livre << endl;
    cout << dict << endl;

    return 0;
}
