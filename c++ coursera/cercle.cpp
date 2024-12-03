#include<iostream>
#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif
#include<cmath>
using namespace std ;
class cercle {  
    private :
        double rayon;
        double x;
        double y;
    public :
        
        void setcentre(double x , double y) {
            this->x = x;
            this->y = y;
        }
        double surface(){
            return (double)M_PI * rayon * rayon ;
        }
        bool estinterieur(double x , double y){
            if(sqrt((x*x)+(y*y))<=rayon){
                return true;
            }
            else return false;
        }
        void setrayon(double r){
            rayon = r;

        }


};
int main(){
    cercle c1,c2 ;
    c1.setrayon(5.0);
    cout << "la surface du c1 = " << c1.surface() << endl ; 
    c2.setcentre(2.0,3.0);
    if(c2.estinterieur(1.0,2.5)){
        cout <<  "ce point est interieur " << endl ;
    }
    else cout << "ce point est exterieur" <<endl ;
    
}