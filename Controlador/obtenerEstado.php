<?php
// controlador/obtenerEstado.php
//require_once __DIR__ . '/../modelo/SeguimientoModel.php';
//header('Content-Type: application/json; charset=utf-8');
//
//if (!isset($_GET['pedido_id'])) {
//    echo json_encode(['error' => 'pedido_id requerido']);
//    exit;
//}
//
//$pedidoId = intval($_GET['pedido_id']);
//$model = new SeguimientoModel();
//$data = $model->obtenerSeguimiento($pedidoId);
//
//if (!$data) {
//    echo json_encode(['error' => 'Pedido no encontrado']);
//    exit;
//}
//
//// Devolver datos crudos de BD (frontend normaliza si hace falta)
//echo json_encode([
//    'idpedido' => (int)$data['idpedido'],
//    'estadopedido' => $data['estadopedido'],
//    'latitud' => $data['latitud'] !== null ? (float)$data['latitud'] : null,
//    'longitud' => $data['longitud'] !== null ? (float)$data['longitud'] : null,
//    'direccion' => $data['direccion'] ?? null,
//    'total' => isset($data['total']) ? (float)$data['total'] : null

// controlador/obtenerEstado.php
error_reporting(0); // Desactivar errores visibles
ini_set('display_errors', 0);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../modelo/SeguimientoModel.php';

if (!isset($_GET['pedido_id'])) {
    echo json_encode(['error' => 'pedido_id requerido']);
    exit;
}

$pedidoId = intval($_GET['pedido_id']);

try {
    $model = new SeguimientoModel();
    $data = $model->obtenerSeguimiento($pedidoId);

    if (!$data) {
        echo json_encode(['error' => 'Pedido no encontrado']);
        exit;
    }

    // Devolver datos en formato JSON limpio
    echo json_encode([
        'idpedido' => (int)$data['idpedido'],
        'estadopedido' => $data['estadopedido'],
        'latitud' => $data['latitud'] !== null ? (float)$data['latitud'] : null,
        'longitud' => $data['longitud'] !== null ? (float)$data['longitud'] : null,
        'direccion' => $data['direccion'] ?? null,
        'total' => isset($data['total']) ? (float)$data['total'] : null
    ]);
    
} catch (Exception $e) {
    echo json_encode(['error' => 'Error en el servidor']);
}
?>