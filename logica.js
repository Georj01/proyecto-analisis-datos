// =======================================================================
// 1. CONFIGURACIÓN INICIAL DE LOS GRÁFICOS (Estado Base)
// =======================================================================

// Gráfico 1: Embudo de Retención 
// Lo guardamos en 'window.graficoEmbudo' para poder acceder a él y modificarlo más tarde.
const ctxFunnel = document.getElementById('funnelChart').getContext('2d');
window.graficoEmbudo = new Chart(ctxFunnel, {
    type: 'bar',
    data: {
        labels: ['Inicio', 'Listado Productos', 'Detalle Producto', 'Carrito', 'Pago', 'Compra Realizada'],
        datasets: [{
            label: 'Usuarios Activos',
            data: [15000, 11200, 8500, 4200, 1100, 850], // Estos datos falsos se sobrescribirán
            backgroundColor: '#2563eb',
            borderRadius: 4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    afterLabel: function(context) {
                        if (context.dataIndex === 0) return '';
                        const prevValue = context.dataset.data[context.dataIndex - 1];
                        const currentValue = context.raw;
                        const drop = ((prevValue - currentValue) / prevValue * 100).toFixed(1);
                        return `Caída: -${drop}%`;
                    }
                }
            }
        }
    }
});

// Gráfico 2: Tiempos de decisión vs Conversión (Estático por ahora)
const ctxTime = document.getElementById('timeChart').getContext('2d');
window.graficoTiempo = new Chart(ctxTime, {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'Sesiones de Usuario',
            data: [
                {x: 45, y: 1}, {x: 120, y: 3}, {x: 180, y: 5}, {x: 30, y: 0},
                {x: 210, y: 6}, {x: 55, y: 1}, {x: 300, y: 8}, {x: 90, y: 2}
            ],
            backgroundColor: '#ef4444'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { title: { display: true, text: 'Tiempo en página (segundos)' } },
            y: { title: { display: true, text: 'Errores de formulario' } }
        }
    }
});

// Gráfico 3: Rage Clicks (Estático por ahora)
const ctxRage = document.getElementById('rageClickChart').getContext('2d');
window.graficoRage = new Chart(ctxRage, {
    type: 'polarArea',
    data: {
        labels: ['Botón "Aplicar Cupón"', 'Selector de Talla', 'Checkbox Términos', 'Carrusel Imágenes'],
        datasets: [{
            data: [450, 120, 890, 50],
            backgroundColor: [
                'rgba(59, 130, 246, 0.7)',
                'rgba(16, 185, 129, 0.7)',
                'rgba(239, 68, 68, 0.7)',
                'rgba(245, 158, 11, 0.7)'
            ]
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});


// =======================================================================
// 2. LÓGICA DE PROCESAMIENTO DE DATOS (El Cerebro)
// =======================================================================
const fileInput = document.getElementById('csvFileInput');

fileInput.addEventListener('change', function(evento) {
    const archivo = evento.target.files[0];
    
    if (!archivo) return;

    console.log("Archivo detectado, iniciando extracción de datos...");

    Papa.parse(archivo, {
        header: true, 
        dynamicTyping: true,
        skipEmptyLines: true, // Vital para no contar líneas vacías al final del CSV y romper la lógica
        complete: function(resultados) {
            const datosBrutos = resultados.data;
            
            console.log(`¡Datos procesados! Total de filas reales: ${datosBrutos.length}`);
            
            // 1. Inicializamos los contadores del embudo a cero
            let contadores = {
                'Inicio': 0,
                'Listado Productos': 0,
                'Detalle Producto': 0,
                'Carrito': 0,
                'Pago': 0,
                'Compra Realizada': 0
            };

            // 2. Extracción y conteo lógico
            datosBrutos.forEach(fila => {
                // Validación: nos aseguramos de que la fila y la columna existen antes de tocarlas
                if (fila && fila.ultimo_paso) {
                    // .trim() elimina espacios invisibles al principio o final del texto ("Pago " -> "Pago")
                    const paso = fila.ultimo_paso.trim(); 
                    
                    if (contadores[paso] !== undefined) {
                        contadores[paso]++;
                    }
                }
            });

            // 3. Lógica Acumulativa del Embudo:
            // Quien llegó al pago, lógicamente también pasó por el carrito y los pasos previos.
            const totalCompra = contadores['Compra Realizada'];
            const totalPago = totalCompra + contadores['Pago'];
            const totalCarrito = totalPago + contadores['Carrito'];
            const totalDetalle = totalCarrito + contadores['Detalle Producto'];
            const totalListado = totalDetalle + contadores['Listado Productos'];
            const totalInicio = totalListado + contadores['Inicio'];

            // 4. Formateamos los datos para inyectarlos en Chart.js
            const nuevosDatos = [totalInicio, totalListado, totalDetalle, totalCarrito, totalPago, totalCompra];
            
            // 5. Ejecutamos la actualización visual
            window.graficoEmbudo.data.datasets[0].data = nuevosDatos;
            window.graficoEmbudo.update();
            
            console.log("Dashboard actualizado con éxito.");
        },
        error: function(error) {
            console.error("Error técnico al leer el CSV:", error);
        }
    });
});