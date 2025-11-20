<?php
// Controlador/crearPedido.php
session_start();
header("Content-Type: application/json");

require_once "../modelo/conexion.php";

// Verificar sesión
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["status" => "error", "mensaje" => "Debes iniciar sesión"]);
    exit;
}

// Verificar ubicación validada
if (!isset($_SESSION['ubicacion_validada']) || !$_SESSION['ubicacion_validada']) {
    echo json_encode(["status" => "error", "mensaje" => "Debes validar tu ubicación"]);
    exit;
}

// Recibir datos del pedido
$data = json_decode(file_get_contents("php://input"), true);

$usuario_id = $_SESSION['usuario_id'];
$productos = $data['productos'] ?? [];
$total = floatval($data['total'] ?? 0);
$metodo_pago = $data['metodo_pago'] ?? 'Mercado Pago';

// Obtener ubicación de la sesión
$latitud = $_SESSION['latitud'];
$longitud = $_SESSION['longitud'];
$direccion = $_SESSION['direccion'];

// Determinar turno (08-11 o 18-23)
$hora_actual = date('H');
if ($hora_actual >= 8 && $hora_actual < 11) {
    $turno = '08-11';
} elseif ($hora_actual >= 18 && $hora_actual < 23) {
    $turno = '18-23';
} else {
    echo json_encode([
        "status" => "error", 
        "mensaje" => "Fuera del horario de servicio (8-11am y 6-11pm)"
    ]);
    exit;
}

try {
    $pdo->beginTransaction();
    
    // Insertar pedido en la BD
    $stmt = $pdo->prepare("
        INSERT INTO pedido (idusuario, total, estadopedido, turno, latitud, longitud, direccion)
        VALUES (?, ?, 'en_espera', ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $usuario_id,
        $total,
        $turno,
        $latitud,
        $longitud,
        $direccion
    ]);
    
    $pedido_id = $pdo->lastInsertId();
    
    // Insertar productos del pedido
    $stmt_producto = $pdo->prepare("
        INSERT INTO pedidoproducto (idpedido, idproducto, cantidad, subtotal)
        VALUES (?, ?, ?, ?)
    ");
    
    foreach ($productos as $producto) {
        $stmt_producto->execute([
            $pedido_id,
            $producto['id'],
            $producto['cantidad'],
            $producto['subtotal']
        ]);
    }
    
    // Registrar pago
    $stmt_pago = $pdo->prepare("
        INSERT INTO pago (idpedido, nombre_cliente, direccion, total, metodopago, estado)
        VALUES (?, ?, ?, ?, ?, 'pendiente')
    ");
    
    $stmt_pago->execute([
        $pedido_id,
        $_SESSION['nombre'] ?? 'Cliente',
        $direccion,
        $total,
        $metodo_pago
    ]);
    
    $pdo->commit();
    
    echo json_encode([
        "status" => "success",
        "mensaje" => "Pedido creado exitosamente",
        "pedido_id" => $pedido_id
    ]);
    
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error al crear el pedido: " . $e->getMessage()
    ]);
}
?>