<?php
// modelo/SeguimientoModel.php
require_once __DIR__ . '/Conexion.php';

class SeguimientoModel {
    private $conn;
    
    public function __construct() {
        $db = new Conexion();
        $this->conn = $db->abrirConexion();
    }
    
    // Devuelve la fila del pedido por idpedido
    public function obtenerSeguimiento($pedidoId) {
        $stmt = $this->conn->prepare("
            SELECT idpedido, idusuario, total, estadopedido, latitud, longitud, direccion, fechacreacion
            FROM pedido WHERE idpedido = ?
        ");
        $stmt->execute([$pedidoId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    // Obtener el primer pedido en espera (FIFO)
    public function obtenerPrimerPedidoEnEspera() {
        $stmt = $this->conn->prepare("
            SELECT idpedido, idusuario, total, estadopedido, latitud, longitud, direccion, fechacreacion
            FROM pedido 
            WHERE estadopedido = 'en_espera'
            ORDER BY fechacreacion ASC, idpedido ASC
            LIMIT 1
        ");
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    // Verificar si hay un pedido en preparación
    public function hayPedidoEnPreparacion() {
        $stmt = $this->conn->prepare("
            SELECT COUNT(*) as total 
            FROM pedido 
            WHERE estadopedido = 'preparando'
        ");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['total'] > 0;
    }
    
    // Obtener el pedido actualmente en preparación
    public function obtenerPedidoEnPreparacion() {
        $stmt = $this->conn->prepare("
            SELECT idpedido, estadopedido
            FROM pedido 
            WHERE estadopedido = 'preparando'
            LIMIT 1
        ");
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    // Actualiza estado con validación FIFO
    public function actualizarEstado($pedidoId, $nuevoEstado) {
        $allowed = ['en_espera','preparando','listo','en_camino','entregado','cancelado'];
        if (!in_array($nuevoEstado, $allowed)) {
            return ['ok' => false, 'error' => 'Estado no válido'];
        }
        
        // Obtener estado actual del pedido
        $pedidoActual = $this->obtenerSeguimiento($pedidoId);
        if (!$pedidoActual) {
            return ['ok' => false, 'error' => 'Pedido no encontrado'];
        }
        
        $estadoActual = $pedidoActual['estadopedido'];
        
        // VALIDACIÓN FIFO: Solo se puede cambiar a 'preparando' si:
        // 1. No hay otro pedido en preparación
        // 2. Este es el primer pedido en espera (FIFO)
        if ($nuevoEstado === 'preparando') {
            // Verificar que no haya otro pedido preparándose
            if ($this->hayPedidoEnPreparacion()) {
                return ['ok' => false, 'error' => 'Ya hay un pedido en preparación'];
            }
            
            // Verificar que este sea el primer pedido en espera
            $primerEnEspera = $this->obtenerPrimerPedidoEnEspera();
            if (!$primerEnEspera || $primerEnEspera['idpedido'] != $pedidoId) {
                return ['ok' => false, 'error' => 'Este pedido no es el siguiente en la fila'];
            }
        }
        
        // VALIDACIÓN: Transiciones de estado permitidas
        $transicionesPermitidas = [
            'en_espera' => ['preparando', 'cancelado'],
            'preparando' => ['listo', 'cancelado'],
            'listo' => ['en_camino', 'cancelado'],
            'en_camino' => ['entregado', 'cancelado'],
            'entregado' => [], // Estado final
            'cancelado' => [] // Estado final
        ];
        
        if (!in_array($nuevoEstado, $transicionesPermitidas[$estadoActual])) {
            return ['ok' => false, 'error' => "No se puede cambiar de '$estadoActual' a '$nuevoEstado'"];
        }
        
        // Actualizar el estado
        $stmt = $this->conn->prepare("
            UPDATE pedido 
            SET estadopedido = ?, ultimaactualizacion = NOW() 
            WHERE idpedido = ?
        ");
        $success = $stmt->execute([$nuevoEstado, $pedidoId]);
        
        if ($success) {
            return ['ok' => true, 'nuevo_estado' => $nuevoEstado];
        } else {
            return ['ok' => false, 'error' => 'Error al actualizar el estado'];
        }
    }
    
    // Obtener todos los pedidos ordenados por FIFO
    public function obtenerTodosPedidos() {
        $stmt = $this->conn->prepare("
            SELECT idpedido, idusuario, total, estadopedido, direccion, fechacreacion
            FROM pedido 
            ORDER BY 
                CASE estadopedido
                    WHEN 'preparando' THEN 1
                    WHEN 'listo' THEN 2
                    WHEN 'en_camino' THEN 3
                    WHEN 'en_espera' THEN 4
                    WHEN 'entregado' THEN 5
                    WHEN 'cancelado' THEN 6
                END,
                fechacreacion ASC
        ");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>