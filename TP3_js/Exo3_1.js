
function getuserdata(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            const issuccess = Math.random() > 0.5;
            if(issuccess){
                resolve("Données récupérées avec succès !");
            }
            else reject("Erreur : Impossible de récupérer les données");
        },1000);
    });
}
function fetchuserdata(){
    const message =  document.getElementById('userData');
    message.textContent = 'chargement ...';
    getuserdata().then(value => {
        message.textContent = value;
        message.style.color = "green";
    })
    .catch(value => {
        message.textContent = value;
        message.style.color="red";
    })

};
document.getElementById('show').addEventListener("click",fetchuserdata);
