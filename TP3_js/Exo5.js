function fetchUserName() {
    
    
    // URL de l'API pour obtenir un utilisateur
    const url ='https://jsonplaceholder.typicode.com/users/1';
    const xhr = new XMLHttpRequest();
     // Ouvre une requête GET asynchrone
    xhr.open('GET',url,true);
    
    // Lorsque la requête est terminée
    xhr.onload = function() {
        const msg = document.getElementById('userName');
        if(xhr.status === 200){
            const user = JSON.parse(xhr.responseText);
            msg.textContent=`Nom d'utilisateur : ${user.name}`;
        } else {
            msg.textContent = 'Erreur lors de la récupération du nom';
        }

        
    };
    xhr.onerror = function() {
        document.getElementById("userName").textContent = "Erreur réseau";
    };
    // Envoie la requête
    xhr.send();
}

// Associe la fonction au clic du bouton
document.getElementById('fetchName').addEventListener('click',fetchUserName)
