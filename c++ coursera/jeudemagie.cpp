#include<iostream>
#include<vector>
using namespace std ;

class magicien {
    private :
    int age ;
    int money ;
    public :
        int getage(int cal){
            return ((cal + 115)-((cal + 115)%10))/100  ;
        }
        int getmoney(int cal){
            return (cal + 115)%10;
        }
};
class spectateur {
    private :
        int age ;
        int money ;
    public :
        void setage(int ag){
           age = ag; 
        }
        int egtage() const{
            return age;
        }
        void setmoney(int mon){
            if(mon < 100){
            money = mon;
            }
            else 
            cout << "too much money ";
        }
        int getmoney()const {
            return money; 
        }
        
};
class assistant {
    private:
        int age ;
        int money;
    public :
        int calcul(){
            return ((((2 * age ) + 5) * 50 ) + money ) - 365 ;
        }
};

class papier {
    public :
        
        
};