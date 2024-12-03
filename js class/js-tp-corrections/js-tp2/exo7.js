
window.onload = function () {

	// affiche le nombre "t" dans le span "spanElt"
	// "t" a au plus deux chiffres
	function afficher(t, span) {
		let img=span.querySelectorAll('img');
		img[1].src="images/"+(t%10)+".png";
		img[0].src="images/"+Math.floor(t/10)+".png";
	}

	// met à jour les images de l'horloge
	// à chaque seconde
	function tictac() {
		let date= new Date();
		afficher(date.getHours(), t[0])
		afficher(date.getMinutes(), t[1])
		afficher(date.getSeconds(), t[2])
	}

	// ici, il faut lancer l'horloge
	setInterval(tictac, 1000)
	let t=document.querySelectorAll('#horloge span');
};