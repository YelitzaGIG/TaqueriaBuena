<?php
//// controlador/actualizarEstado.php
//require_once __DIR__ . '/../modelo/SeguimientoModel.php';
//
//header('Content-Type: application/json; charset=utf-8');
//
//if (!isset($_POST['pedido_id']) || !isset($_POST['nuevo_estado'])) {
//    echo json_encode(['ok' => false, 'error' => 'Parámetros requeridos: pedido_id, nuevo_estado']);
//    exit;
//}
//
//$pedidoId = intval($_POST['pedido_id']);
//$nuevoEstado = trim($_POST['nuevo_estado']);
//
//$model = new SeguimientoModel();
//$resultado = $model->actualizarEstado($pedidoId, $nuevoEstado);
//
//echo json_encode($resultado);

// controlador/actualizarEstado.php
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../modelo/SeguimientoModel.php';

if (!isset($_POST['pedido_id']) || !isset($_POST['nuevo_estado'])) {
    echo json_encode(['ok' => false, 'error' => 'Parámetros requeridos: pedido_id, nuevo_estado']);
    exit;
}

$pedidoId = intval($_POST['pedido_id']);
$nuevoEstado = trim($_POST['nuevo_estado']);

try {
    $model = new SeguimientoModel();
    $resultado = $model->actualizarEstado($pedidoId, $nuevoEstado);
    
    echo json_encode($resultado);
    
} catch (Exception $e) {
    echo json_encode(['ok' => false, 'error' => 'Error en el servidor']);
}
?>