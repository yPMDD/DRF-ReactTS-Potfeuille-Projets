
<?php
   use PHPMailer\PHPMailer\PHPMailer;
   
    require 'vendor/autoload.php';

   $db_server = "localhost";
   $db_user = "root";
   $db_pass = "";
   $db_name = "square";

       $connex = new PDO("mysql:host=$db_server;dbname=$db_name", $db_user, $db_pass);
       $connex->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
   
       if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['button'])) {
           $email = $_POST['email'];
   
           $stmt = $connex->prepare("SELECT id FROM users WHERE email = :email");
           $stmt->bindParam(':email', $email, PDO::PARAM_STR);
           $stmt->execute();
           $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
           if (count($result) > 0) {
               $token = bin2hex(random_bytes(16));
               $expiry = date("Y-m-d H:i:s", strtotime("+1 hour"));
   
               // Insert token and expiry into the database
               $stat = $connex->prepare(
                   "INSERT INTO mdp_reset(email, token, expires_at) 
                    VALUES (:email, :token, :expiry)"
               );
               $stat->bindParam(':email', $email, PDO::PARAM_STR);
               $stat->bindParam(':token', $token, PDO::PARAM_STR);
               $stat->bindParam(':expiry', $expiry, PDO::PARAM_STR);
               $stat->execute();
   
               $subject = "Reset Password Request";
               $body = "Click <a href='http://localhost/projects/ecom/resetmdp.php?token=$token'>here</a> to reset your password";
               
               
$mail = new PHPMailer(true);


    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com'; // Use your email provider's SMTP host
    $mail->SMTPAuth = true;
    $mail->Username = 'your-email@gmail.com'; // Your email
    $mail->Password = 'your-email-password'; // Your email password or app-specific password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Email Settings
    $mail->setFrom('your-email@gmail.com', 'Your Name');
    $mail->addAddress($email); // Recipient's email
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $body;

    $mail->send();
    echo "Email sent successfully!";

       }
    }
  
   ?>
    













<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form method="post">
        <label for="email">email</label>
        <input type="text" name="email">
        <button name="button">send email</button>
    </form>
</body>
</html>