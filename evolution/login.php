<?php session_start();?>
<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>
<!DOCTYPE html>

<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="styles/login_styles.css">
        <title>Evolution | Log In</title>
        <link rel="icon" href="images/E_mdwra.webp" type="image/x-icon">
    </head>
<body>
    <div class="box">
        <div class="boks">
<img src="styles/images/logo.jpg" alt="E mdwra" class="E_mdwra">
        </div>
        <form method="post">
    <h1>Log in</h1>
    
    <div class="tit">Email</div>
    <div class="input_box" > 
        <input type="email" name="email" placeholder="Evolution@gmail.com" required>
    </div>
    <div class="tit">
        <p>Password
            <a href="#" class="forgot_mdp">Forgot password ? </a>
        </p>
    
        </div>
    <div class="input_box">
        <input type="password" name="mdp" placeholder="*********" required>
    </div>
    
            <button type="submit" name="submit" class="btn">LOGIN</button>
           
            <div class="register_link">
                <p>Don't have an account ? 
                    <a href="signup.php" class="regi_link">Sign Up</a></p>
            </div> 
        </div>

        </form>
    </body>
</html>

<?php
$db_server = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "evolution";


try {
    $connex = new PDO("mysql:host=$db_server;dbname=$db_name", $db_user, $db_pass);
    $connex->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if($_SERVER['REQUEST_METHOD']== 'POST' && isset($_POST['submit'])){

        $email = htmlspecialchars($_POST['email']);
        $mdp = htmlspecialchars($_POST['mdp']);
        
        $query = $connex->prepare(" SELECT mdp FROM users WHERE email = :email");
        $query->bindParam(':email',$email,PDO::PARAM_STR);
        $query->execute();

        if($query->rowCount() > 0){

            $user = $query->fetch(PDO::FETCH_ASSOC);
            $hashed_password = $user['mdp']; // Access hash


            if (password_verify($mdp,$hashed_password)) {
                header("Location: ur_in.php");
                exit();
            } else {
                header("Location: mdp_i.php");
                exit();
                //echo "password not correct";
                    }
        } else{
            $_SESSION['entered_password'] = $mdp;
            $_SESSION['stored_hash'] = $hashed_password;
            header("Location: email_notfound.php");
            exit();
            // echo'email not found';
        }
        
    
        }
    } catch (PDOException $e) {
        echo "Database error: " . $e->getMessage();
        exit();
    }
    

?>

