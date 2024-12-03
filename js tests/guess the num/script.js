const minnum = 1 ;
const maxnum = 10 ;
const answer = Math.floor( Math.random() * ( maxnum - minnum + 1 )) + minnum;

let att =0;
let guess ;
let run = true ;
while (run) {
    
    guess = window.prompt(`guess a number between ${minnum} and ${maxnum}`);
    guess = Number(guess);
    if(isNaN(guess)) {
        window.alert(`Please enter a number between ${minnum} and ${maxnum}`);
    }
    else if (guess < minnum || guess > maxnum) {
        window.alert(`Please enter a number between ${minnum} and ${maxnum}`);
    }
    else { 
        if (guess > answer){
        att++;
        window.alert('Too high!');
    }
    else if (guess < answer) {
        att++;
        window.alert('Too low!');
    }
    else   {
        window.alert(`Congratulations! You guessed the number correctly. in ${att} attempt it was ${answer} `);
        run = false;
    }
        }
    
    }

