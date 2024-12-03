

function rollDice(){
    const result = document.getElementById("result");
    const numofdice = document.getElementById("numofdice").value;
    const diceimages = document.getElementById("diceimages");
    const values =[];
    const images = [];
    for(let i=0 ; i<numofdice ; i++){
        const num = Math.floor(Math.random() * 6) + 1;
        values.push(num);
        images.push(`<img src="dice_images/inverted-dice-${num}.png" alt="dice ${num}" >  `);
        
    }
    result.textContent = ` dice : ${values.join(', ')} ` ;
    diceimages.innerHTML = images.join("");
}