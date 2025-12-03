<?php
// conexion.php
error_reporting(0);
ini_set('display_errors', 0);

 //Datos de la base de datos
//$host = "192.168.1.120";
//$port = "330t6";
//$dbname = "taquerialacruz9";
//$user = "desarrollo";
//$pass = "12345678";
//$charset = "utf8mb4"

 //Datos de la base de datos
$host = "192.168.1.41";
$port = "3306";
$dbname = "taquerialacruz9";
$user = "desarrollo";
$pass = "sotocruz7898";
$charset = "utf8mb4";

// //Datos de la base de datos
//$host = "127.0.0.1";
//$port = "8080";
//$dbname = "taquerialacruz9";
//$user = "desarrollo";
//$pass = "desarrollo";
//$charset = "utf8mb4";


try {
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$dbname;charset=$charset", 
        $user, 
        $pass, 
        $options
    );

} catch (PDOException $e) {
    // No mostrar el error directamente, solo registrarlo
    error_log("Error de conexión: " . $e->getMessage());
    
    // Si es una petición AJAX, devolver JSON
    if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
        strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
        header("Content-Type: application/json");
        echo json_encode([
            "status" => "error",
            "mensaje" => "Error de conexión a la base de datos"
        ]);
        exit;
    }
    
    die("Error de conexión a la base de datos");
}
?>