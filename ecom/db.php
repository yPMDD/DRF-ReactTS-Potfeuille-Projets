
<?
$db_server = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "square";



    $connex = new PDO("mysql:host=$db_server;dbname=$db_name", $db_user, $db_pass);
    