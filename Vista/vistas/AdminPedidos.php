<?php
// vista/vistas/AdminPedidos.php
require_once __DIR__ . '/../../modelo/SeguimientoModel.php';

$model = new SeguimientoModel();
$pedidos = $model->obtenerTodosPedidos();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administración de Pedidos</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        h1 { text-align: center; color: #333; margin-bottom: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .pedido-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .pedido-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .pedido-id { font-weight: bold; font-size: 18px; }
        .estado {
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
        }
        .estado-en_espera { background: #ffd700; color: #333; }
        .estado-preparando { background: #ff8c00; color: white; }
        .estado-listo { background: #4caf50; color: white; }
        .estado-en_camino { background: #2196f3; color: white; }
        .estado-entregado { background: #9c27b0; color: white; }
        .estado-cancelado { background: #f44336; color: white; }
        .pedido-info { margin: 10px 0; color: #666; }
        .botones { display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap; }
        button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: opacity 0.3s;
        }
        button:hover { opacity: 0.8; }
        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .btn-preparar { background: #ff8c00; color: white; }
        .btn-listo { background: #4caf50; color: white; }
        .btn-enviar { background: #2196f3; color: white; }
        .btn-cancelar { background: #f44336; color: white; }
        .btn-ver { background: #9c27b0; color: white; }
        .alerta {
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            display: none;
        }
        .alerta.error { background: #ffebee; color: #c62828; border: 1px solid #ef5350; }
        .alerta.success { background: #e8f5e9; color: #2e7d32; border: 1px solid #66bb6a; }
        .alerta.warning { background: #fff3e0; color: #ef6c00; border: 1px solid #ffa726; }
        .mensaje-fifo {
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌮 Administración de Pedidos - Taquería La Cruz</h1>
        
        <div class="mensaje-fifo">
            <strong>📋 Sistema FIFO:</strong> Los pedidos se preparan en orden de llegada. 
            Solo se puede preparar un pedido a la vez.
        </div>

        <div id="alerta" class="alerta"></div>

        <div id="pedidos-container">
            <?php if (empty($pedidos)): ?>
                <p style="text-align: center; color: #999; padding: 40px;">No hay pedidos registrados</p>
            <?php else: ?>
                <?php foreach ($pedidos as $pedido): ?>
                    <div class="pedido-card" data-pedido-id="<?= $pedido['idpedido'] ?>">
                        <div class="pedido-header">
                            <span class="pedido-id">Pedido #<?= $pedido['idpedido'] ?></span>
                            <span class="estado estado-<?= $pedido['estadopedido'] ?>">
                                <?= strtoupper(str_replace('_', ' ', $pedido['estadopedido'])) ?>
                            </span>
                        </div>
                        
                        <div class="pedido-info">
                            <p><strong>Total:</strong> $<?= number_format($pedido['total'], 2) ?></p>
                            <p><strong>Dirección:</strong> <?= htmlspecialchars($pedido['direccion']) ?></p>
                            <p><strong>Fecha:</strong> <?= date('d/m/Y H:i', strtotime($pedido['fechacreacion'])) ?></p>
                        </div>
                        
                        <div class="botones">
                            <?php if ($pedido['estadopedido'] === 'en_espera'): ?>
                                <button class="btn-preparar" onclick="cambiarEstado(<?= $pedido['idpedido'] ?>, 'preparando')">
                                    🔥 Comenzar a Preparar
                                </button>
                                <button class="btn-cancelar" onclick="cambiarEstado(<?= $pedido['idpedido'] ?>, 'cancelado')">
                                    ❌ Cancelar
                                </button>
                            <?php elseif ($pedido['estadopedido'] === 'preparando'): ?>
                                <button class="btn-listo" onclick="cambiarEstado(<?= $pedido['idpedido'] ?>, 'listo')">
                                    ✅ Marcar como Listo
                                </button>
                                <button class="btn-cancelar" onclick="cambiarEstado(<?= $pedido['idpedido'] ?>, 'cancelado')">
                                    ❌ Cancelar
                                </button>
                            <?php elseif ($pedido['estadopedido'] === 'listo'): ?>
                                <button class="btn-enviar" onclick="cambiarEstado(<?= $pedido['idpedido'] ?>, 'en_camino')">
                                    🚗 Enviar con Repartidor
                                </button>
                                <button class="btn-cancelar" onclick="cambiarEstado(<?= $pedido['idpedido'] ?>, 'cancelado')">
                                    ❌ Cancelar
                                </button>
                            <?php endif; ?>
                            
                            <button class="btn-ver" onclick="verSeguimiento(<?= $pedido['idpedido'] ?>)">
                                👁️ Ver Seguimiento
                            </button>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>

    <script>
        function mostrarAlerta(mensaje, tipo = 'success') {
            const alerta = document.getElementById('alerta');
            alerta.textContent = mensaje;
            alerta.className = 'alerta ' + tipo;
            alerta.style.display = 'block';
            
            setTimeout(() => {
                alerta.style.display = 'none';
            }, 5000);
        }

        async function cambiarEstado(pedidoId, nuevoEstado) {
            try {
                const formData = new FormData();
                formData.append('pedido_id', pedidoId);
                formData.append('nuevo_estado', nuevoEstado);
                
                const response = await fetch('/TaqueriaBuena/controlador/actualizarEstado.php', {
                    method: 'POST',
                    body: formData
                });
                
                const resultado = await response.json();
                
                if (resultado.ok) {
                    mostrarAlerta('✅ Estado actualizado correctamente', 'success');
                    setTimeout(() => location.reload(), 1000);
                } else {
                    mostrarAlerta('⚠️ ' + resultado.error, 'warning');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarAlerta('❌ Error al cambiar el estado', 'error');
            }
        }

        function verSeguimiento(pedidoId) {
            window.open('/TaqueriaBuena/index.php?action=seguimiento&pedido_id=' + pedidoId, '_blank');
        }

        // Actualizar cada 10 segundos
        setInterval(() => {
            location.reload();
        }, 10000);
    </script>
</body>
</html>