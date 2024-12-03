
window.onload = function () {
	
	// les noms des fichiers images
	var sources = ["paysage-1.jpg", "paysage-2.jpg", "paysage-3.jpg",
		"paysage-4.jpg", "paysage-5.jpg", "paysage-6.jpg",
		"paysage-7.jpg", "paysage-8.jpg", "paysage-9.jpg"];

	// l'indice de l'image actuellement visible
	var indice = 0;

	// affiche l'image suivante
	function next() {
		if(++indice==sources.length)indice=0;
		document.querySelector("#show").src = "images/"+sources[indice];
	}

	// affiche l'image précédente
	function previous() {
		if(--indice==-1)indice=sources.length-1
		document.querySelector("#show").src = "images/"+sources[indice];
	}

	// ici, il faut relier le JS à l'évènement "onclick" sur
	// les deux "flèches" (les images)
	let arrs = document.querySelectorAll(".arrow");
	arrs[0].onclick = previous;
	arrs[1].onclick = next ;
};