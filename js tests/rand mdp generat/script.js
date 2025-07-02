

 function generatemdp(){
        const mdplen = document.getElementById("mdplen").value;
        const includelow = document.getElementById("lowercase").checked;
        const includeup =document.getElementById("uppercase").checked;
        const includenum = document.getElementById("numbers").checked;
        const includesymbol = document.getElementById("symbols").checked;
        const result = document.getElementById("mdp");
        const lowercasechars = "abcdefghijklmnopqrstuvwxyz";
        const uppercasechars = lowercasechars.toUpperCase();
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+-?/"
        let allowedchars ="";
        let mdp = "";
        
        if(includelow){
            allowedchars += lowercasechars;
        }
        if(includeup){
            allowedchars += uppercasechars;
        }
        if(includenum){
            allowedchars += numbers;
        }
        if(includesymbol){
            allowedchars += symbols;
        }
        if(mdplen<=0){
            result.textContent = "Invalid length";
            return "" ;
        };wqweqwe
        if(allowedchars.length===0){
            result.textContent = "No character type selected";
            return "" ;
        }        
        for(let i=0; i<mdplen; i++){
            mdp += allowedchars[Math.floor(Math.random()*allowedchars.length)];
        }
    
        result.textContent = `generate password : ${mdp}`;

}







