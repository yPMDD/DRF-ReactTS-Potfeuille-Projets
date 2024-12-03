
// le tableau qui contient le chemin
// du fichier image pour chaque image
var t = [];

// si clicked[i] == true alors array[i] est visible
var clicked = [];

// pour décider si un clic est
// un premier clic ou non
var first_click = true;

// l'indice de la première image cliquée
var first_index = 0;

// le nombre total de paires de clics
var clicks_number = 0;

// the nombre de paires de clics réussis
// (les paires de clics qui ont découvert
// des images identiques)
var good_clicks_number = 0;

// affecte à l'attribut src des deux images d'indice i et j
// le source de l'image "point d'interrogation"
function hide(i, j) {
    setTimeout(function(){
        t[i].src=t[j].src="images/question-mark.png"
        clicked[i]=clicked[j]=false
    }, 1000)
}

// gère le clic sur l'image d'indice n
function click_image(n) {
    if(clicked[n]) return
	t[n].src=t[n].dataset.code
    clicks_number++
    clicked[n]=true;
    if(first_click){
        first_index=n
    }else{
        if(t[first_index].dataset.code == t[n].dataset.code){
            good_clicks_number+=2
            if(good_clicks_number==t.length){
                document.querySelector("#result").innerHTML=
                `Vous avez réussi après ${clicks_number} clics`
                document.querySelector("#result").style.visibility="visible"
            }
        }else{
            hide(n, first_index)
        }
    }
    first_click=!first_click
}

// rempli le tableau array avec la valeur de
// l'attribut 'data-code' des images
function init() {
	t= document.querySelectorAll('#grid img')
}

window.onload = init;
