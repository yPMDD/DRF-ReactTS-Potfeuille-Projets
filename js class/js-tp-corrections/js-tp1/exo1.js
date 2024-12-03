
// calcule le prix TTC à partir du prix hors-taxe
// et de la TVA
// affiche une alerte avec un message d'erreur si les
// valeurs fournies ne sont pas des nombres
function prixTTC() {
    let pht=document.getElementById('pht'), tva=document.getElementById('tva');
    if(isNaN(pht.value) || isNaN(tva.value)){
        alert("Valeurs incorrectes!")
        pht.focus()
    }else{
        document.getElementById('pttc').innerHTML=(pht.value*(1+tva.value)/100).toFixed(2)
        document.getElementById('resultat').style.visibility="visible"
    }
}

function effacer(){
    document.getElementById('resultat').style.visibility="hidden"
    document.getElementById('pht').value="0"
}
