<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Submitting FORM</h1>
    <form method="POST">
        <label for="nom">Nom : </label>
        <input name="nom" type="text" required><br>
        <label for="prenom">Prenom : </label>
        <input name="prenom" type="text" required><br>
        <label for="date">Date de naiss : </label>
        <input name="date" type="date" required><br>
        <label for="email">Email : </label>
        <input name="email" type="email" required><br>
        <label for="num">Num de tel : </label>
        <input name="num" type="text" required><br>
        <label for="niveau">Niveau : </label>
        <select name="niveau" required>
            <option value="1">1er annee</option>
            <option value="2">2e annee</option>
            <option value="3">3e annee</option>
        </select><br>
        <button type="submit" name="submit" >SUBMIT</button> 
    </form>
</body>
</html>

<?php

function age($date){
    $birth = strtotime($date);
    $curyear=date("y");
    $curmonth=date("m");
    $curday=date("d");

    $birthyear =date("y",$birth);
    $birthday=date("d",$birth);
    $birthmonth=date("m",$birth);
    $age=$curyear-$birthyear;
    if(($curmonth<$birthmonth)||($curmonth==$birthmonth && $curday<$birthday)){
        $age--;
    }
    if($age<=0){
        echo " please enter a valid birthday";
    }else{echo"<br>ur $age yo";}
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['submit']) &&
!empty($_POST['nom']) && !empty($_POST['prenom']) &&
!empty($_POST['email']) && !empty($_POST['date']) &&
!empty($_POST['niveau']) && !empty($_POST['num'])){
    
    $nom = htmlspecialchars($_POST['nom']);
    $prenom = htmlspecialchars($_POST['prenom']);
    $email = htmlspecialchars($_POST['email']);
    $date = htmlspecialchars($_POST['date']);
    $niveau = htmlspecialchars($_POST['niveau']);
    $num = htmlspecialchars($_POST['num']);

echo"Bienvenue $nom $prenom ";
age($date);
}
else {echo'veuillez remplir tous les champs';}

    
        
?>