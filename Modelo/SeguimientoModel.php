<?php
class SeguimientoModel {

    private $db;

    public function __construct() {
        require __DIR__ . '/../config/conexion.php';
        $this->db = $conexion;
    }

    // Crear pedido
    public function crearPedido($usuarioId, $direccion, $total, $lat, $lng, $estadoInicial) {
        $sql = "INSERT INTO pedidos (usuario_id, direccion, total, latitud, longitud, estadopedido) 
                VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param("isddds", $usuarioId, $direccion, $total, $lat, $lng, $estadoInicial);

        if ($stmt->execute()) {
            return $stmt->insert_id;
        }
        return false;
    }

    // Agregar productos al pedido
    public function agregarProductoPedido($pedidoId, $item) {
        $sql = "INSERT INTO pedido_detalle (idpedido, nombre, precio, cantidad, opciones, instrucciones)
                VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);

        $opciones = isset($item["options"]) ? json_encode($item["options"]) : "[]";
        $instr = $item["instructions"] ?? "";

        $stmt->bind_param(
            "ississ",
            $pedidoId,
            $item["name"],
            $item["price"],
            $item["qty"],
            $opciones,
            $instr
        );
        $stmt->execute();
    }

    // Obtener datos para seguimiento
    public function obtenerPedido($pedidoId) {
        $sql = "SELECT * FROM pedidos WHERE idpedido = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param("i", $pedidoId);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Cambiar estado
    public function cambiarEstado($pedidoId, $estado) {
        $sql = "UPDATE pedidos SET estadopedido = ? WHERE idpedido = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param("si", $estado, $pedidoId);
        return $stmt->execute();
    }

    public function obtenerEstado($pedidoId) {
        $sql = "SELECT estadopedido, latitud, longitud FROM pedidos WHERE idpedido = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param("i", $pedidoId);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Obtener pedidos para Admin
    public function obtenerTodosPedidos() {
        $sql = "SELECT * FROM pedidos ORDER BY fechacreacion DESC";
        return $this->db->query($sql)->fetch_all(MYSQLI_ASSOC);
    }
}
