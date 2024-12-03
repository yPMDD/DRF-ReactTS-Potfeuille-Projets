<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TP2_ex3</title>
</head>
<body>
    <h1>ajouter un nouveau produit</h1>
    <form action="" method="post">
    <label for="product">Désignation : </label>
    <input type="text" name="product" id=" product"> <br>
    <label for="quantity">Quantité :</label>     
    <input type="text" name="quantity" id="quantity"><br>
    <button type="submit" name = 'send'>Ajouter</button>
    </form>


    <?php
    
     $servername = "localhost";
     $username= "root";
     $password="";
     $dbname="test";

     $connex = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
     if($_SERVER['REQUEST_METHOD']==='POST' && isset($_POST['send'])){
        
        if(empty($_POST['product']) && empty($_POST['quantity']) ){
            echo "veuiller tous remplir";
        }
        elseif(!is_numeric($_POST['quantity'])){
            echo "la quantité doit contenir un nombre valide.";
        }
        else{
            if(isset($_POST['send'])){
            $pro= $_POST['product'];
            $quan=$_POST['quantity'];

            $query=$connex->prepare("INSERT into product (Designation, Quantiy) values ('$pro', '$quan')");
            
            if($query->execute()){
                echo "nouvel enregistrement";
                
            }

            }
        }
     }
     
    


    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete'])) {
        $delete_id = $_POST['delete_id'];
        $deleteQuery = $connex->prepare("DELETE FROM product WHERE id = $delete_id");
        $deleteQuery->execute();
        echo "Produit supprimé avec succès.";
    }
   
         $query=$connex->prepare("SELECT * FROM product");
         $query->execute();
         $tab=$query->fetchALL(PDO::FETCH_ASSOC);
         
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_POST['update'])){
        $var = $_GET['modified_id'];
    }
         echo "<h1>Liste des produits : </h1> <br>";
    echo "<table border='0'>";
    echo "<tr><th>ID</th><th>Désignation</th><th>Quantité</th></tr>";
    
    
    foreach ($tab as $elements) {
        echo "<tr>";
        echo "<td>" . $elements['id'] . "</td>";
        echo "<td>" . $elements['Designation'] . "</td>";
        echo "<td>" . $elements['Quantiy'] . "</td>";
        echo "<td>"
."        <form action='modify.php' method='get'>
            <input type='hidden' name='modified_id' value='" . $elements['id'] . "'>
            <button name ='update'>Modifier</button></td></form>";
        echo "<td><form action='TP2_ex3.php' method='post'>
                        <input type='hidden' name='delete_id' value='" . $elements['id'] . "'>
                        <button type='submit' name='delete'>Supprimer</button>
                    </form></td>";
    
        echo "</tr>";
    
    }

    echo "</table>";
    
    $connex = null;
     ?>
</body>
</html>