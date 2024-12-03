// Fonction pour afficher un message avec un délai et une couleur spécifiques
function showMessageWithDelay(message, color, delay) {
    return new Promise((resolve)=>{
        setTimeout(()=>{
        const msg = document.createElement('p');
        msg.textContent = message;
        msg.style.color = color;
        msg.className='message';
        document.getElementById('messages').appendChild(msg);
        resolve();
    },delay);
});
    
}

// Fonction pour enchaîner les messages
function displayMessages() {
    const delay = 1000;
    document.getElementById('messages').innerHTML='';
    showMessageWithDelay('message 1','red',delay)
    .then(()=>showMessageWithDelay('message 2','blue',delay))
    .then(()=>showMessageWithDelay('message 3','green',delay))
    .then(()=>showMessageWithDelay('message 4','purple',delay));
}

document.getElementById('show').addEventListener('click',displayMessages);
