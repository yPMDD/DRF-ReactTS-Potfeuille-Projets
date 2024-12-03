
// le nombre d'essais dans la partie courante
let  essais = 0;
// le nombre total d'essais de toutes les parties
let  nbEssais = 0;
// le nombre de paties jouées et terminées
let  nbParties = 0;
// indique si on est en train de jouer une partie
let  partieEnCours = true;
// le nombre à deviner
let  secret = generer();
// le nombre d'essais du meilleur jeu
// Number.MAX_SAFE_INTEGER est la plus grande valeur
// entière possible
let  meilleurJeu = Number.MAX_SAFE_INTEGER;

// vérifie la proposition de l'utilisateur et :
// - si la proposition est incorrecte, affiche la bonne
//   indication (trop petit ou trop grand)
// - sinon affiche le nombre d'essais qui ont été nécessaires
//   et mets à jour les statistiques
function verifier() {
    if(!partieEnCours)return;
    essais++;nbEssais++;
	let prop=document.querySelector('#proposition');
    if(isNaN(prop.value)){
        afficher("Valeur incorrecte!");
    }else if(prop.value < secret){
        afficher("Trop petit!");
    }else if(prop.value > secret){
        afficher("Trop grand!");
    }else{
        nbParties++;
        partieEnCours=false;
        if(meilleurJeu>essais)meilleurJeu=essais;
        afficher(`Vous avez réussi après ${essais} tentatives.`,"#00FF00");
        afficherStat();
    }
}

// si 'encore' est vrai, démarre une nouvelle partie
// sinon termine le jeu en affichant le message adéquat
function jouerEncore( encore ) {
    document.querySelector("#proposition").value="";
    document.querySelector("#question").style.visibility="hidden";
    afficher(encore?"C'est parti":"Salina", "blue");
	if(encore){
        partieEnCours=true;
        essais=0;
        secret=generer();
        document.querySelector("#proposition").focus();
    }
}

// affiche un message dans une couleur donnée
// dans l'élément prévu à cet effet
function afficher( message, couleur="red" ) {
    document.querySelector("#message").innerHTML=message;
    document.querySelector("#message").style.color=couleur;
    document.querySelector("#message").style.fontWeight="normal";
    setTimeout(()=>{
        document.querySelector("#message").style.fontWeight="bolder";
    },1000);
}

// met à jour les statistiques
function afficherStat() {
    document.querySelector("#question").style.visibility="visible";
    document.querySelector("#nbParties").innerHTML=nbParties;
    document.querySelector("#nbMoyenEssais").innerHTML=(nbEssais/nbParties).toFixed(2);
    document.querySelector("#meilleurJeu").innerHTML=meilleurJeu;
}

// retourne un nombre aléatoire dans l'intervalle [1, 100]
function generer() {
	return Math.floor(Math.random()*100+1)
}
