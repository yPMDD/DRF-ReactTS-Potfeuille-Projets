#include"rationnel.cpp"


int main(){
    rat n;
    saisie(n);
    affich(n);
    float a = conv(n);
    cout << a << endl;
    rat s = inversion(n);
    affich(s);
    int PG = pgcd(n);
    cout<<"le pgcd de "; affich(n); cout<< "est " << PG << endl;
    rat x = reduct(n);
    affich(x);
}