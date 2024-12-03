#include<iostream>
#include"headers.cpp"
using namespace std;
void saisie(rat a ){
    int x,y;
    cout << "Saisir le numerateur : ";
    cin >> x;
    cout << "Saisir le denominateur : ";
    cin >> y;
    a.num=x;
    a.den=y;
    
}

void affich(rat a){
    cout << a.num << "/" << a.den << endl;
}
float conv(rat a){
    return (float)(a.num/a.den);
}

rat inversion(rat a){
    rat temp;
    temp.num=a.den;
    temp.den=a.num;
    return temp;
}
int pgcd(rat a) {
    int num = a.num;
    int den = a.den;
    
    while (den != 0) {
        int temp = den;
        den = num % temp;
        num = temp;
    }
    return num;
}
rat reduire(rat a) {
    int divisor = pgcd(a);  
    a.num /= divisor;       
    a.den /= divisor;      
    return a;
}