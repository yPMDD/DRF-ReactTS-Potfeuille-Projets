<?php session_start();?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>email notfound</h1>
</body>
</html>
<?php
  // Start the session

// Check if session variables are set
if (isset($_SESSION['entered_password']) && isset($_SESSION['stored_hash'])) {
    $entered_password = $_SESSION['entered_password'];
    $stored_hash = $_SESSION['stored_hash'];

    // Echo the entered password and stored hash to see their values
    echo "Entered Password: " . htmlspecialchars($entered_password) . "<br>";
    echo "Stored Hash: " . htmlspecialchars($stored_hash) . "<br>";

    // Clear session variables after displaying them (optional)
    unset($_SESSION['entered_password']);
    unset($_SESSION['stored_hash']);
} else {
    echo "No session data found.";
}
?>
