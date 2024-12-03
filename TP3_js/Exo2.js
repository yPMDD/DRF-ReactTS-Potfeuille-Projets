function displayMessage(callback, delay) {
    setTimeout(callback, delay);
}

function ClickButton() {
    const delayInput = document.getElementById('delayInput');
    const messageElement = document.getElementById('message');
    messageElement.textContent = ''; 

    const delay = parseInt(delayInput.value);

    if (isNaN(delay) || delay <= 0) {
        messageElement.textContent = 'Veuillez entrer un délai valide (en millisecondes).';
        return;
    }

    displayMessage(showMessage, delay);
}

function showMessage() {
    const messageElement = document.getElementById('message');
    messageElement.textContent = 'Bienvenue ! Le message s\'affiche après le délai.';
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('startButton').addEventListener("click", ClickButton);
});