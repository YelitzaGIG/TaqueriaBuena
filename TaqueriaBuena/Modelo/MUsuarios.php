<?php
//MUsuarios.php
require_once "conexion.php";

class MUsuarios {

    /* ===== Login Google ===== */
    /* Buscar usuario por correo o google_id */
    public function buscarUsuarioGoogle($email, $google_id) {
        global $pdo;
        $sql = "SELECT * FROM usuarios WHERE correo_telefono = ? OR google_id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$email, $google_id]);
        return $stmt->fetch();
    }

    /* Registrar usuario Google */
    public function registrarUsuarioGoogle($nombre, $email, $google_id) {
        global $pdo;
        $sql = "INSERT INTO usuarios (usuario, correo_telefono, contrasena, google_id, tipo_usuario)
                VALUES (?, ?, NULL, ?, 'google')";
        $stmt = $pdo->prepare($sql);
        return $stmt->execute([$nombre, $email, $google_id]);
    }

    /* ===== Login Normal ===== */
    /* Login con usuario o teléfono, solo tipo 'normal' */
    public function loginNormal($usuario_o_telefono, $contrasena) {
        global $pdo;
        $sql = "SELECT * FROM usuarios 
                WHERE (usuario = ? OR correo_telefono = ?) 
                AND tipo_usuario = 'normal'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$usuario_o_telefono, $usuario_o_telefono]);
        $user = $stmt->fetch();

        if ($user && password_verify($contrasena, $user['contrasena'])) {
            return $user;
        }

        return false;
    }
}
?>

