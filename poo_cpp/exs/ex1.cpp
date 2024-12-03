#include <iostream>
using namespace std;

class somme {
    private:
        int n1, n2;
    
    public:
        
        somme(int a, int b) : n1(a), n2(b) {}

        
        int sum() {
            return n1 + n2;
        }
};

int main() {
    int n1, n2;
    
    cout << "Entrer le 1er nombre: ";
    cin >> n1;
    cout << "Entrer le 2ème nombre: ";
    cin >> n2;

    
    somme s(n1, n2);

    cout << "La somme des deux nombres est : " << s.sum() ;

    cin >> n1;
}
