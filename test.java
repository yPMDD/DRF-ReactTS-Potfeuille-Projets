public class test {

    public static class CompteBancaire {
       private String numCompte;
       private String NomProprietaire;
       private double solde ;
       private static int compteur=0;

       public CompteBancaire(String nc , String np , double si){
        compteur++;
        numCompte=nc;
        NomProprietaire=np;
        solde=si;
       }

        public void deposer(double m){
            if(m>0){
                solde+=m;
                System.out.println("Depot de " + m + " effectue. Nouveau solde : " + solde);
            } else {
                System.out.println("Le montant à déposer doit être positif");
            }
        }
        public void retirer(double m){
            if(m>0 && m<=solde){
                solde-=m;
                System.out.println("Retrait de " + m + " effectue. Nouveau solde : " + solde);
            } else if(m > solde) {
                System.out.println("Fonds insuffisants pour effectuer ce retrait.");
            } else{
                System.out.println("Le montant a retirer doit etre positif.");
            }
        }
        public void afficher() {
            System.out.println("Numéro de compte : " + numCompte);
            System.out.println("Propriétaire : " + NomProprietaire);
            System.out.println("Solde : " + solde);
        }
        public static int getCompteur() {
            return compteur;
        }
        public String getNumeroCompte() {
            return numCompte;
        }
    
        public void setNumeroCompte(String n) {
            numCompte = n;
        }
    
        public String getNomProprietaire() {
            return NomProprietaire;
        }
    
        public void setNomProprietaire(String n) {
            NomProprietaire = n;
        }
    
        public void consulterSolde() {
            System.out.println("votre solde est : "+ solde);
        }
    }
    public static void main(String[] args){
        System.out.println("hello,world");
    }
}
