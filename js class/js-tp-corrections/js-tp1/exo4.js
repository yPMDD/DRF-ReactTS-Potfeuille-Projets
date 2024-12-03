
// teste si les champs du formulaire sont corrects et :
// - si ils le sont, retourne 'true'
// - sinon, affiche le message d'erreur adéquat dans
//   l'emplacement prévu à cet effet, et retourne 'false'
function checkform() {
   let log=document.getElementById("log");
   let pass1=document.getElementById("pass1");
   let pass2=document.getElementById("pass2");
   if(!/^[a-zA-Z]{3,}$/.test(log.value)){
    errormsg("Login in correct!");
    log.focus();
    return false;
   }
   if(pass1.value.length<4){
    errormsg("Pass incorrect!");
    pass1.focus();
    return false;
   }
   if(pass1.value != pass2.value){
    errormsg("Les mdp sont différents!");
    pass2.focus();
    return false;
   }
   return true;
}

// efface le contenu de l'élément où on affiche
// les messages d'erreur et cache cet élément
function resetform() {
    document.getElementById('erreur').style.visibility="hidden";
}

// écrit 'msg' dans l'élément où on affiche
// les messages d'erreur et montre cet élément
function errormsg(msg) {
    document.getElementById('erreur').innerHTML=msg;
    document.getElementById('erreur').style.visibility="visible";
}