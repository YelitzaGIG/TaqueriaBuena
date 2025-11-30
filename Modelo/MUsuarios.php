<?php
// modelo/MUsuarios.php
require_once __DIR__ . "/conexion.php";

class MUsuarios {
    /* ======================================================
       BUSCAR USUARIO — Google (por email o google_id)
    ====================================================== */
    public function buscarUsuarioGoogle($email, $google_id) {
        global $pdo;
        try {
            error_log("🔍 buscarUsuarioGoogle INICIO");
            error_log("  - Email: '$email'");
            error_log("  - Google_ID: '$google_id'");
            
            // Primero buscar por google_id (más confiable)
            $sql = "SELECT * FROM usuarios WHERE google_id = ? LIMIT 1";
            error_log("  - SQL 1: $sql");
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$google_id]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            error_log("  - Resultado búsqueda por google_id: " . ($result ? 'ENCONTRADO' : 'NO ENCONTRADO'));
            
            // Si no encuentra por google_id, buscar por email
            if (!$result) {
                $sql = "SELECT * FROM usuarios WHERE correo_telefono = ? LIMIT 1";
                error_log("  - SQL 2: $sql");
                
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$email]);
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                
                error_log("  - Resultado búsqueda por email: " . ($result ? 'ENCONTRADO' : 'NO ENCONTRADO'));
            }
            
            if ($result) {
                error_log("  - ✅ Usuario encontrado ID: " . $result['id']);
                error_log("  - Datos: " . print_r($result, true));
            } else {
                error_log("  - ❌ Usuario NO encontrado");
            }
            
            return $result ?: false;
            
        } catch (PDOException $e) {
            error_log("❌ EXCEPCIÓN en buscarUsuarioGoogle:");
            error_log("  - Código: " . $e->getCode());
            error_log("  - Mensaje: " . $e->getMessage());
            error_log("  - Línea: " . $e->getLine());
            error_log("  - Archivo: " . $e->getFile());
            return false;
        } catch (Exception $e) {
            error_log("❌ EXCEPCIÓN GENERAL en buscarUsuarioGoogle:");
            error_log("  - Mensaje: " . $e->getMessage());
            return false;
        }
    }

    /* ======================================================
       REGISTRAR USUARIO — Google
       Devuelve: INT (nuevo id) | false
    ====================================================== */
    public function registrarUsuarioGoogle($nombre, $email, $google_id) {
        global $pdo;
        
        error_log("📝 registrarUsuarioGoogle INICIO");
        error_log("  - Nombre: '$nombre'");
        error_log("  - Email: '$email'");
        error_log("  - Google_ID: '$google_id'");
        
        try {
            // Verificar una vez más si ya existe
            $existente = $this->buscarUsuarioGoogle($email, $google_id);
            if ($existente && isset($existente['id'])) {
                error_log("  - ⚠️ Usuario ya existe, retornando ID: " . $existente['id']);
                return (int)$existente['id'];
            }
            
            // Insertar nuevo usuario Google
            $sql = "INSERT INTO usuarios (usuario, correo_telefono, contrasena, google_id, tipo_usuario) VALUES (?, ?, NULL, ?, 'google')";
            
            error_log("  - SQL INSERT: $sql");
            error_log("  - Parámetros: [$nombre, $email, NULL, $google_id, 'google']");
            
            $stmt = $pdo->prepare($sql);
            
            if (!$stmt) {
                error_log("  - ❌ Error en prepare()");
                error_log("  - PDO Error Info: " . print_r($pdo->errorInfo(), true));
                return false;
            }
            
            error_log("  - ✅ Prepare exitoso");
            
            $ok = $stmt->execute([$nombre, $email, $google_id]);
            
            error_log("  - Execute retornó: " . ($ok ? 'TRUE' : 'FALSE'));
            error_log("  - Stmt Error Info: " . print_r($stmt->errorInfo(), true));
            
            if ($ok) {
                $newId = $pdo->lastInsertId();
                
                error_log("  - 🎉 lastInsertId(): $newId");
                error_log("  - Tipo: " . gettype($newId));
                error_log("  - Valor como int: " . (int)$newId);
                
                if ($newId && (int)$newId > 0) {
                    error_log("  - ✅ REGISTRO EXITOSO - ID: " . (int)$newId);
                    return (int)$newId;
                } else {
                    error_log("  - ❌ lastInsertId() retornó valor inválido: " . var_export($newId, true));
                    
                    // Intentar buscar el usuario recién insertado
                    error_log("  - Intentando buscar usuario recién insertado...");
                    $verificar = $this->buscarUsuarioGoogle($email, $google_id);
                    if ($verificar && isset($verificar['id'])) {
                        error_log("  - ✅ Usuario encontrado después de insertar, ID: " . $verificar['id']);
                        return (int)$verificar['id'];
                    }
                    
                    return false;
                }
            } else {
                error_log("  - ❌ Execute retornó FALSE");
                return false;
            }
            
        } catch (PDOException $e) {
            error_log("❌ PDOException en registrarUsuarioGoogle:");
            error_log("  - Código: " . $e->getCode());
            error_log("  - Mensaje: " . $e->getMessage());
            error_log("  - SQL State: " . ($stmt->errorInfo()[0] ?? 'N/A'));
            error_log("  - Error Code: " . ($stmt->errorInfo()[1] ?? 'N/A'));
            error_log("  - Error Message: " . ($stmt->errorInfo()[2] ?? 'N/A'));
            error_log("  - Línea: " . $e->getLine());
            
            // Si hay error de duplicado (código 23000)
            if ($e->getCode() == 23000 || strpos($e->getMessage(), 'Duplicate') !== false) {
                error_log("  - ⚠️ Error de duplicado detectado");
                $existing = $this->buscarUsuarioGoogle($email, $google_id);
                if ($existing && isset($existing['id'])) {
                    error_log("  - ✅ Retornando ID existente: " . $existing['id']);
                    return (int)$existing['id'];
                }
            }
            
            return false;
            
        } catch (Exception $e) {
            error_log("❌ Exception GENERAL en registrarUsuarioGoogle:");
            error_log("  - Mensaje: " . $e->getMessage());
            error_log("  - Línea: " . $e->getLine());
            error_log("  - Archivo: " . $e->getFile());
            return false;
        }
    }

    /* ======================================================
       LOGIN NORMAL
    ====================================================== */
    public function loginNormal($usuario_o_telefono, $contrasena) {
        global $pdo;
        try {
            $sql = "SELECT * FROM usuarios 
                    WHERE (usuario = ? OR correo_telefono = ?) 
                    AND tipo_usuario = 'normal'
                    LIMIT 1";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$usuario_o_telefono, $usuario_o_telefono]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && password_verify($contrasena, $user['contrasena'])) {
                return $user;
            }
            return false;
        } catch (PDOException $e) {
            error_log("Error en loginNormal: " . $e->getMessage());
            return false;
        }
    }
}
?>