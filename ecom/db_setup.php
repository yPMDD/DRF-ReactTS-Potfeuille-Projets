<?
$db_server = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "square";

    $connex = new PDO("mysql:host=$db_server;dbname=$db_name", $db_user, $db_pass);
    $connex->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// create the users table
    $query = $connex->prepare(
        "CREATE table users(
            id int AUTO_INCREMENT PRIMARY KEY ,
            user varchar(50) not null ,
            email varchar(50) not null ,
            mdp varchar(255) not null,
            regi_time TIMESTAMP default CURRENT_TIMESTAMP)
        ");
        $query->execute();
    
    // CREATE 

    $sql = $connex->prepare(
        "CREATE TABLE cart (
            id INT NOT NULL,
            pic varchar(255) not null,
            product VARCHAR(50) NOT NULL,
            quantity INT,
            price DOUBLE NOT NULL,
            FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
    )       
        
    ");
    $sql->execute();

    //create table for mdp reset 

    $req = $connex->prepare(
        "CREATE TABLE mdp_reset(
        id int auto_increment primary key ,
        email varchar(50) not null ,
        token varchar(255) not null , 
        expires_at datetime not null,
        created_at timestamp default current_timestamp,
        foreign key (email) references email(users) on delete cascade)
    ");