<?php
// controllerRegistrarse.php
session_start();
require_once "../modelo/conexion.php"; // Tu conexión PDO

class ControllerRegistrarse {

    public static function registrarUsuario($usuario, $celular, $password) {
        global $pdo;

        try {
            // Verificar duplicado
            $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE usuario = ?");
            $stmt->execute([$usuario]);
            if ($stmt->rowCount() > 0) {
                return ["status" => "error", "message" => "El nombre de usuario ya está registrado."];
            }

            // Validar celular
            if (!preg_match("/^[0-9]{10}$/", $celular)) {
                return ["status" => "error", "message" => "Número de celular inválido."];
            }

            // Hashear contraseña
            $hashPassword = password_hash($password, PASSWORD_DEFAULT);

            // Insertar usuario
            $stmt = $pdo->prepare("INSERT INTO usuarios (usuario, correo_telefono, contrasena) VALUES (?, ?, ?)");
            $stmt->execute([$usuario, $celular, $hashPassword]);
            
            // ✅ OBTENER EL ID DEL NUEVO USUARIO
            $usuario_id = $pdo->lastInsertId();
            
            // ✅ GUARDAR EN SESIÓN
            $_SESSION['usuario_id'] = $usuario_id;

            return [
                "status" => "success", 
                "message" => "Usuario registrado con éxito.",
                "usuario_id" => $usuario_id // ✅ DEVOLVER ID
            ];
        } catch (PDOException $e) {
            return ["status" => "error", "message" => "Error al registrar usuario: " . $e->getMessage()];
        }
    }
}