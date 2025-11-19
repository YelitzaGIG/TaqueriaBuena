<?php
// conexion.php

// Datos de la base de datos
$host = "127.0.0.1";        // o la IP del servidor MySQL
$port = "8080";             // PUERTO AGREGADO
$dbname = "taqueriabuena";
$user = "desarrollo";       // cambia esto si tu usuario es diferente
$pass = "desarrollo";     // cambia esto si tu contraseña no está vacía
$charset = "utf8mb4";

try {
    // Configuración de opciones PDO
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,        // Lanzar excepciones en errores
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,   // Devolver resultados como array asociativo
        PDO::ATTR_EMULATE_PREPARES => false,               // Preparar sentencias de manera nativa
    ];

    // Crear conexión PDO con puerto
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=$charset", $user, $pass, $options);

    // Conexión exitosa (opcional)
    // echo "Conexión exitosa";

} catch (PDOException $e) {
    // Manejo de errores de conexión
    die("Error de conexión a la base de datos: " . $e->getMessage());
}
?>