<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles/signup.css">
    <link rel="icon" href="styles/images/no_bg.png" type="image/x-icon">
    <title>Square | Sign up</title>
</head>
<body>
    <div class="box">
        <div class="boks">
            <img src="styles/images/1732832232686.png" alt="E mdwra" class="E_mdwra">
        </div>
        <h1 class="signup">Sign Up</h1>
        
        <form method="POST">
            <div class="user">Username</div>
            <div class="user_box">
                <input type="text" name="user" id="user" placeholder="Username" required>
            </div>
            <div class="email">Email</div>
            <div class="email_box">
                <input type="email" name="email" id="email" placeholder="Evolution@gmail.com" required>
            </div>
        
            <div class="mdp">Password (8 or more characters)</div>
            <div class="mdp_box">
                <input type="password" name="mdp" id="mdp" placeholder="**********" required>
            </div>
            <div class="alrdi">
                <p class="member"> Already have an account !
                    <a class="login" href="login.php">LOG IN</a>
                </p> 
            </div>
            <button type="submit" name="submit" id="submit" class="btn" >SIGN UP</button>
        </form>
        
    </div>
    
</body>
</html>
<?php

$db_server = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "square";

    $connex = new PDO("mysql:host=$db_server;dbname=$db_name", $db_user, $db_pass);
    $connex->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    



if($_SERVER['REQUEST_METHOD']== 'POST' && isset($_POST['submit'])){
    $username = htmlspecialchars($_POST['user']);
    $email = htmlspecialchars($_POST['email']);
    $mdp = htmlspecialchars($_POST['mdp']);
    
    $hashed_mdp = password_hash($mdp,PASSWORD_BCRYPT);
    $email_verify_query = $connex->prepare("SELECT email FROM users 
                                        WHERE email=:email");
    $email_verify_query->bindParam(':email', $email, PDO::PARAM_STR);
    $email_verify_query->execute();   
    $email_existance=$email_verify_query->fetch(PDO::FETCH_ASSOC);        
    $user_verify_query = $connex->prepare("SELECT user FROM users 
                                        WHERE user =:user");
    $user_verify_query->bindParam(':user', $username, PDO::PARAM_STR);

    $user_verify_query->execute();
    $user_existance = $user_verify_query->fetch(PDO::FETCH_ASSOC);

if(!empty($email_existance)){
    ob_start();
    header("Location: email_alr.php" );
    exit();
    ob_end_flush();
 }
 elseif(!empty($user_existance)){
    ob_start();
    header("Location: user_alr.php");
    exit();
    ob_end_flush();
 }

 else{

    $sql = "INSERT INTO users(user, email, mdp) VALUES (:user, :email, :mdp)";
    $stmt = $connex->prepare($sql);
    $stmt->bindParam(':user', $username, PDO::PARAM_STR);
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->bindParam(':mdp', $hashed_mdp, PDO::PARAM_STR);
    $insertion=$stmt->execute();

  if($insertion){
    ob_start();
    header("Location: index.html");
    exit();
    ob_end_flush();    
}
else{
    ob_start();
    header("Location: regi_failed.html");
    exit();
    ob_end_flush();  
}
}
    
}
 $connex=null;

?>