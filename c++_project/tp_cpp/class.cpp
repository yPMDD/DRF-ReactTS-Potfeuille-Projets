#include <iostream>
#include <string>
using namespace std;


class monome{
    private:
    int coef;
    int deg;
    public:
    monome(int c, int d): int coef(c), int deg(d){}
   

    void aff(){
      cout << coef <<"X^" << deg <<endl; 
    }

    void saisie (){
        cout << "saisir le coefficient :"<<endl ;
        cin >> coef;
        cout << "saisir le degres :" <<endl;
        cin >> deg;
    }


    monome operator+(monome m) {
    if (this->degres == m.degres) {
        return monome(this->coef + m.coef, this->deg);
    }
    else
    { 
       cout<<"les degres ne sont pas compatibles";
    }
    }

    monome operator*(monome m) {
        return  monome(this->coef * m.coef, this->deg + m.deg);
    }

    bool operator==(monome m){
        if(this->coeaf == m.coef && this->deg == m.deg){
            return 1;
        }
        else return 0;
    }

    bool operator<(monome m){
        if(this->deg < m.deg){
            return 1;
        }
        else return 0;
    }

    bool operator!(monome m){
        if(this->coef == NULL){
            return 1;
        }
        else return 0;
    }

    monome operator~(monome m){
        return monome(this->coef*m.deg, m.deg-1);
    }

};



