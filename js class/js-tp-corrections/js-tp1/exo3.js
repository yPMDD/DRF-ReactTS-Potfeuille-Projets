
let x; // le premier nombre de la multiplication
let y; // le deuxième nombre de la multiplication

// donne le rôle du bouton :
// si 'verifier' est 'true' alors le prochain clic sur le bouton
// est destiné à vérifier la réponse de l'utilisateur, sinon,
// le clic est destiné à proposer une nouvelle multiplication
let verifier = true; 

// génére une nouvelle multiplication, autrement dit :
// - génère deux entiers au hasard dans l'intervalle [1,9]
// - les affiche dans les bons éléments HTML
function nouvelle() {
    document.getElementById("nombre1").innerHTML=x=Math.floor(Math.random()*9+1)
    document.getElementById("nombre2").innerHTML=y=Math.floor(Math.random()*9+1)
}

// cette fonction est appelée quand l'utilisateur clique
// sur le bouton. La fonction a deux rôles alternatifs :
// - vérifier que la proposition de l'utilisateur est correcte
// - générer une nouvelle multiplication
// Cette alternance est gérée à l'aide de la variable 'verifier'
function valider() {
    let prop=document.getElementById("proposition");
    let resu=document.getElementById("resultat");
    let btn=document.getElementById('bouton');
    if(verifier){
        if(isNaN(prop.value)){
            alert("Vleur non numérique!");
            prop.focus();
        }else if(prop.value==x * y){
            resu.innerHTML="Bonne réponse";
            resu.style.visibility="visible";
            btn.value="Continuer";
            verifier=false;
        }else{
            resu.innerHTML="Mauvaise réponse";
            resu.style.visibility="visible";
        }
    }else{
        nouvelle();
        btn.value="Vérifier";
        verifier=true;
        resu.style.visibility="hidden";
        prop.value="";
        prop.focus();
    }
}


