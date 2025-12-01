<?php
// controlador/SeguimientoController.php
require_once __DIR__ . '/../modelo/SeguimientoModel.php';

class SeguimientoController {
    private $model;

    public function __construct() {
        $this->model = new SeguimientoModel();
    }

    public function mostrar() {
        if (!isset($_GET['pedido_id'])) {
            echo "No se proporcionó un ID de pedido.";
            return;
        }

        $pedidoId = intval($_GET['pedido_id']);
        $data = $this->model->obtenerSeguimiento($pedidoId);

        if (!$data) {
            echo "El pedido no existe.";
            return;
        }

        // Cargar la vista (ruta relativa a este archivo)
        require __DIR__ . '/../vista/vistas/SeguimientoPedido.php';
    }
}
?>
