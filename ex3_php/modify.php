
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modifier Produit</title>
</head>
<body>
<h1>Modification du produit ayant l'id = 
<?php 
$id = isset($_GET['modified_id']) ? $_GET['modified_id'] : null;
echo htmlspecialchars($id);
?>

<?php
if ($id === null) {
    echo "ID invalide.";
    exit;
}


$servername = "localhost";
$username = "root";
$password = "";
$dbname = "test";

$connex = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
$connex->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


$queryy = $connex->prepare("SELECT * FROM product WHERE id = :id");
$queryy->bindParam(':id', $id, PDO::PARAM_INT);
$queryy->execute();
$product = $queryy->fetch(PDO::FETCH_ASSOC);

if (!$product) {
    echo "Produit non trouvé.";
    echo "<br><a href='TP2_ex3.php'>Retour à la liste des produits</a>";
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['send'])) {
    $newDesignation = $_POST['text'];
    $newQuantity = $_POST['quan'];

    
    $updateQuery = $connex->prepare("UPDATE product SET Designation = :designation, Quantiy = :quantity WHERE id = :id");
    $updateQuery->bindParam(':designation', $newDesignation, PDO::PARAM_STR);
    $updateQuery->bindParam(':quantity', $newQuantity, PDO::PARAM_INT);
    $updateQuery->bindParam(':id', $id, PDO::PARAM_INT);

    
}
?>

</h1>
<form action="modify.php?modified_id=<?php echo htmlspecialchars($id); ?>" method="POST">
    <label for="text">Nouvelle désignation :</label>
    <input type="text" name="text" value="<?php echo htmlspecialchars($product['Designation']); ?>" required><br><br>

    <label for="quan">Nouvelle quantité :</label>
    <input type="number" name="quan" value="<?php echo htmlspecialchars($product['Quantiy']); ?>" required><br><br>

    <button type="submit" name="send">Mettre à jour</button>
</form>
<br>

<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['send'])) {
if ($updateQuery->execute()) {
    echo "<br>Produit mis à jour avec succès.";
    echo "<br><a href='TP2_ex3.php'>Retour à la liste des produits</a>";
    
} else {
    echo "Erreur lors de la mise à jour du produit.";
    echo "<br><a href='TP2_ex3.php'>Retour à la liste des produits</a>";
}
}

$connex = null;
?>


</body>
</html>
