
window.onload = function () {

	// pour distinguer les premiers clics
	// des seconds clics
	let first_click = true;

	// pour stocker la première image cliquée
	let first_image;

	// si "not_finished" est vrai, alors
	// il reste des images à permuter
	let not_finished = true;

	// traîte le clic sur une image
	function click_on() {
		if(not_finished)
			if(first_click){
				first_image = this;
			}else{
				let tmp=this.src; this.src=first_image.src; first_image.src=tmp;
				tmp=this.dataset.letter;this.dataset.letter=first_image.dataset.letter;
				first_image.dataset.letter=tmp;
				if(is_finished()){
					document.querySelector('#result').style.visibility="visible";
					not_finished=false;
				}
			}
		first_click=!first_click;
	}

	// teste si le puzzle est terminé
	function is_finished() {
		let s="";
		t.forEach(img=>s+=img.dataset.letter);
		return s=='abcdefghijkl';
	}

	// ici, il faut relier la fonction "clic_on" à l'évènement "onclick"
	// sur toutes les images contenues dans l'élément d'id "puzzle"
	//document.querySelector('#puzzle').querySelectorAll('img');
	let t= document.querySelectorAll("div#puzzle img");
	t.forEach(function(img){
		img.onclick=click_on;
	});
};
