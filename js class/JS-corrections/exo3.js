
window.onload = function () {

	// affiche la source de l'image cliquée dans l'image
	// d'id "realize"
	function show() {
		document.querySelector('#realsize').src=this.src;
		document.querySelector('#legend').innerHTML = this.title;
	}

	// ici, il faut relier la fonction "show" à l'évènement "onmouseover"
	// sur toutes les images ayant la classe "miniature"
	let t = document.querySelectorAll('.miniature');
	for(let i=0; i<t.length; i++)
		t[i].onmouseover = show;
};
