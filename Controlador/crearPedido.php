<?php
// crearPedido.php
require_once __DIR__ . '/../modelo/conexion.php';

header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

session_start();

try {
    // ✅ VALIDAR SESIÓN
    if (!isset($_SESSION['usuario_id'])) {
        echo json_encode(["ok" => false, "error" => "No has iniciado sesión"]);
        exit;
    }

    $usuarioId = (int)$_SESSION['usuario_id'];
    error_log("👤 Usuario ID: $usuarioId");

    // ✅ LEER JSON DEL BODY
    $input = file_get_contents("php://input");
    error_log("📥 Input recibido: " . $input);
    
    $data = json_decode($input, true);
    
    if (!$data) {
        echo json_encode(["ok" => false, "error" => "Datos JSON inválidos"]);
        exit;
    }

    // ✅ OBTENER DATOS
    $carrito = isset($data['carrito']) ? $data['carrito'] : null;
    $ubicacion = isset($data['ubicacion']) ? $data['ubicacion'] : null;
    $total = isset($data['total']) ? floatval($data['total']) : 0;

    error_log("🛒 Carrito: " . json_encode($carrito));
    error_log("📍 Ubicación: " . json_encode($ubicacion));
    error_log("💰 Total: $total");

    // ✅ VALIDACIONES
    if (!$carrito || !is_array($carrito) || count($carrito) === 0) {
        echo json_encode(["ok" => false, "error" => "Carrito vacío o inválido"]);
        exit;
    }

    if (!$ubicacion || !isset($ubicacion['latitud']) || !isset($ubicacion['longitud'])) {
        echo json_encode(["ok" => false, "error" => "Ubicación inválida"]);
        exit;
    }

    if ($total <= 0) {
        echo json_encode(["ok" => false, "error" => "Total inválido"]);
        exit;
    }

    // ✅ EXTRAER DATOS DE UBICACIÓN
    $direccion = $ubicacion['direccion'] ?? "Sin dirección";
    $lat = floatval($ubicacion['latitud']);
    $lng = floatval($ubicacion['longitud']);
    $dentroRango = isset($ubicacion['dentro_rango']) && $ubicacion['dentro_rango'] === true;

    // ✅ DETERMINAR TURNO
    $hora = date('H');
    $turno = ($hora >= 8 && $hora < 11) ? '08-11' : '18-23';

    // ✅ ESTADO DEL PEDIDO
    $estadoPedido = $dentroRango ? 'en espera' : 'fuera_rango';

    error_log("🕐 Turno: $turno");
    error_log("✅ Estado: $estadoPedido");

    // ✅ INSERTAR PEDIDO EN LA BD
    global $pdo;

    $sql = "INSERT INTO pedido 
            (idusuario, total, estadopedido, turno, latitud, longitud, direccion) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $pdo->prepare($sql);
    $resultado = $stmt->execute([
        $usuarioId,
        $total,
        $estadoPedido,
        $turno,
        $lat,
        $lng,
        $direccion
    ]);

    if (!$resultado) {
        error_log(" Error al insertar pedido: " . print_r($stmt->errorInfo(), true));
        echo json_encode(["ok" => false, "error" => "Error al crear pedido en BD"]);
        exit;
    }

    $pedidoId = $pdo->lastInsertId();
    error_log("✅ Pedido creado con ID: $pedidoId");

    // ✅ INSERTAR PRODUCTOS DEL PEDIDO
    foreach ($carrito as $item) {
        // Buscar el producto en la BD por nombre
        $sqlProducto = "SELECT idproducto, precio FROM producto WHERE nombreproducto = ? LIMIT 1";
        $stmtProducto = $pdo->prepare($sqlProducto);
        $stmtProducto->execute([$item['name']]);
        $producto = $stmtProducto->fetch(PDO::FETCH_ASSOC);

        if (!$producto) {
            error_log("⚠️ Producto no encontrado: " . $item['name']);
            continue;
        }

        $idProducto = $producto['idproducto'];
        $cantidad = (int)$item['qty'];

        // ✅ CORREGIDO: Convertir arrays a JSON
        $ingredientes = isset($item['options']) && is_array($item['options']) 
            ? json_encode($item['options'], JSON_UNESCAPED_UNICODE)
            : null;
            
        $instrucciones_especiales = isset($item['instructions']) && !empty($item['instructions'])
            ? $item['instructions']
            : null;

        $subtotal = $producto['precio'] * $cantidad;

        $sqlDetalle = "INSERT INTO pedidoproducto 
            (idpedido, idproducto, cantidad, ingredientes, instrucciones_especiales, subtotal)
            VALUES (?, ?, ?, ?, ?, ?)";

        $stmtDetalle = $pdo->prepare($sqlDetalle);
        $stmtDetalle->execute([
            $pedidoId,
            $idProducto,
            $cantidad,
            $ingredientes,
            $instrucciones_especiales,
            $subtotal
        ]);

        error_log("📦 Producto agregado: $idProducto x $cantidad = $$subtotal");
    }

    // ✅ RESPUESTA EXITOSA
    echo json_encode([
        "ok" => true,
        "pedido_id" => $pedidoId,
        "redirect" => "/TaqueriaBuena/Vista/vistas/SeguimientoPedido.php?pedido_id=$pedidoId"
    ]);
    
//    echo json_encode([
//    "ok" => true,
//    "pedido_id" => $pedido_id,
//    "mensaje" => "Pedido creado exitosamente",
//    // ✅ CAMBIAR ESTA LÍNEA:
//    "redirect" => "/TaqueriaBuenaV4/Controlador/SeguimientoController.php?pedido_id=" . $pedido_id
//    //  ANTES ERA: "/TaqueriaBuenaV4/Vista/vistas/SeguimientoPedido.php?pedido_id=" . $pedido_id
//]);

error_log("PEDIDO CREADO EXITOSAMENTE - ID: " . $pedido_id);


} catch (PDOException $e) {
    error_log(" Error PDO: " . $e->getMessage());
    echo json_encode([
        "ok" => false,
        "error" => "Error en la base de datos: " . $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log(" Error general: " . $e->getMessage());
    echo json_encode([
        "ok" => false,
        "error" => "Error del servidor: " . $e->getMessage()
    ]);
}
?>