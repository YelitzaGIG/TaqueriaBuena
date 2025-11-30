<?php
// controlador/actualizarEstado.php
require_once __DIR__ . '/../modelo/SeguimientoModel.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_POST['pedido_id']) || !isset($_POST['nuevo_estado'])) {
    echo json_encode(['ok' => false, 'error' => 'Parámetros requeridos: pedido_id, nuevo_estado']);
    exit;
}

$pedidoId = intval($_POST['pedido_id']);
$nuevoEstado = trim($_POST['nuevo_estado']);

$model = new SeguimientoModel();
$resultado = $model->actualizarEstado($pedidoId, $nuevoEstado);

echo json_encode($resultado);
?>