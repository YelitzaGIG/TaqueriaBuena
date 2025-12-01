<?php
// registrarse.php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

// Incluir el controlador
require_once "../controlador/controllerRegistrarse.php";

// Leer datos enviados por JS
$datos = json_decode(file_get_contents("php://input"), true);

// Depuración: imprimir en el log de PHP lo que se recibe
error_log(print_r($datos, true));

if ($datos) {
    $usuario = trim($datos['usuario']);
    $celular = trim($datos['celular']);
    $password = trim($datos['password']);

    $resultado = ControllerRegistrarse::registrarUsuario($usuario, $celular, $password);

    echo json_encode($resultado);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "No se recibieron datos."
    ]);
}
