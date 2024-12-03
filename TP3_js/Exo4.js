// Fonction simulant une requête réseau pour obtenir la météo d'une ville 

function getWeather(city) {
    return new Promise((resolve,reject)=>{
       setTimeout(()=>{
         if(city.toLowerCase()==='rabat'){
            resolve("La météo à Rabat est ensoleillée, 25°C");
        }
        else reject('Erreur : Aucune donnée de météo pour la ville  '+city);
       },1500);
    })       
}

// Fonction principale qui utilise async/await pour afficher la météo
async function displayWeather() {
    const city = document.getElementById('cityInput').value.trim();
    const result = document.getElementById("weatherResult");
    try{
        const displayWeatherresult = await getWeather(city);
        result.textContent = displayWeatherresult;

    }
    catch(err){
        result.textContent=err;
    }


}

document.getElementById('show').addEventListener("click",displayWeather);

