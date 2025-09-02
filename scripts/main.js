// Configuración de datos
const DATA = {
    franchiseLevels: [50, 100, 150, 170],
    commissions: {
        year1: [15, 20, 25, 30], // Incluye +5% incentivo (10+5, 15+5, 20+5, 25+5)
        year2: [10, 15, 20, 25]  // Sin incentivo año 2+ (máximo 25% para 170)
    },
    revenues: {
        50: { year1: 18000, year2: 12000 },   // 50×200×12×15% = 18k, 50×200×12×10% = 12k ✓
        100: { year1: 48000, year2: 36000 },  // 100×200×12×20% = 48k, 100×200×12×15% = 36k ✓
        150: { year1: 90000, year2: 72000 },  // 150×200×12×25% = 90k, 150×200×12×20% = 72k ✓
        170: { year1: 122400, year2: 102000 } // 170×200×12×30% = 122.4k, 170×200×12×25% = 102k ✓
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado');
    
    // Inicializar cada función por separado para evitar que un error detenga todo
    try {
        initCharts();
        console.log('Charts inicializados');
    } catch (error) {
        console.error('Error en charts:', error);
    }
    
    try {
        initCalculator();
        console.log('Calculadora inicializada');
    } catch (error) {
        console.error('Error en calculadora:', error);
    }
    
    try {
        initAnimations();
        console.log('Animaciones inicializadas');
    } catch (error) {
        console.error('Error en animaciones:', error);
    }
    
    try {
        preventUnwantedTransforms();
        console.log('Transformaciones prevenidas');
    } catch (error) {
        console.error('Error en transformaciones:', error);
    }
    
    // RESPALDO DE EMERGENCIA - Calculadora independiente
    setTimeout(function() {
        console.log('🚨 RESPALDO: Inicializando calculadora de emergencia...');
        
        const slider = document.getElementById('franchiseSlider');
        const countDisplay = document.getElementById('franchiseCount');
        const year1Display = document.getElementById('year1Amount');
        const year2Display = document.getElementById('year2Amount');
        
        if (slider && countDisplay && year1Display && year2Display) {
            console.log('✅ Elementos encontrados, configurando calculadora de emergencia...');
            
            // Función de emergencia
            function emergencyCalculator() {
                const franquicias = parseInt(slider.value);
                console.log(`🔢 Calculando para ${franquicias} franquicias`);
                
                // Actualizar contador
                countDisplay.textContent = franquicias;
                
                // Actualizar slider
                const porcentaje = ((franquicias - 1) / 299) * 100;
                slider.style.background = `linear-gradient(to right, #e91e63 ${porcentaje}%, #e9ecef ${porcentaje}%)`;
                
                // Calcular comisiones
                let com1, com2;
                if (franquicias <= 50) { com1 = 15; com2 = 10; }
                else if (franquicias <= 100) { com1 = 20; com2 = 15; }
                else if (franquicias <= 150) { com1 = 25; com2 = 20; }
                else if (franquicias <= 170) { com1 = 30; com2 = 25; }
                else { com1 = 30; com2 = 25; }
                
                // Calcular ingresos
                const ingresoAnual = franquicias * 200 * 12;
                const ano1 = Math.round((ingresoAnual * com1) / 100);
                const ano2 = Math.round((ingresoAnual * com2) / 100);
                
                // Actualizar display
                year1Display.textContent = `${ano1.toLocaleString('es-ES')}€`;
                year2Display.textContent = `${ano2.toLocaleString('es-ES')}€`;
                
                console.log(`💰 Actualizado: ${franquicias} franquicias = ${ano1}€ / ${ano2}€`);
            }
            
            // Remover eventos anteriores y agregar nuevos
            slider.removeEventListener('input', emergencyCalculator);
            slider.removeEventListener('change', emergencyCalculator);
            slider.addEventListener('input', emergencyCalculator);
            slider.addEventListener('change', emergencyCalculator);
            
            // Ejecutar inmediatamente
            emergencyCalculator();
            
            console.log('🎯 Calculadora de emergencia ACTIVADA');
        } else {
            console.error('❌ No se encontraron los elementos necesarios');
        }
    }, 1000);
    
    // Observer para mantener elementos estáticos
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const target = mutation.target;
                if (target.classList.contains('summary-card') || 
                    target.classList.contains('pricing-card') || 
                    target.classList.contains('metric-card') ||
                    target.classList.contains('metric-card-compact') ||
                    target.classList.contains('advantage-card') ||
                    target.classList.contains('result-card')) {
                    
                    // Si se detecta una transformación, la eliminamos
                    if (target.style.transform && target.style.transform !== 'none') {
                        target.style.transform = 'none';
                    }
                }
            }
        });
    });
    
    // Observar cambios en todos los elementos problemáticos
    const elementsToObserve = document.querySelectorAll('.summary-card, .pricing-card, .metric-card, .metric-card-compact, .advantage-card, .result-card');
    elementsToObserve.forEach(element => {
        observer.observe(element, { attributes: true, attributeFilter: ['style'] });
    });
});

// Gráficos
function initCharts() {
    createCommissionChart();
    createRevenueChart();
}

// Gráfica de comisiones
function createCommissionChart() {
    const ctx = document.getElementById('commissionChart');
    if (!ctx) return;

    // Configurar tamaño del canvas
    ctx.style.maxHeight = '300px';
    ctx.style.width = '100%';

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1-50', '51-100', '101-150', '151-200'],
            datasets: [
                {
                    label: 'Año 1 (con incentivo)',
                    data: [15, 20, 25, 30],
                    backgroundColor: '#1e40af',
                    borderColor: '#1e40af',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                },
                {
                    label: 'Año 2+',
                    data: [10, 15, 20, 25],
                    backgroundColor: '#059669',
                    borderColor: '#059669',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 2,
            layout: {
                padding: {
                    top: 10,
                    bottom: 10
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#374151',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 35,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        color: '#6b7280',
                        font: {
                            family: 'Inter',
                            size: 12,
                            weight: '600'
                        }
                    },
                    grid: {
                        color: '#f3f4f6',
                        lineWidth: 1
                    }
                },
                x: {
                    ticks: {
                        color: '#374151',
                        font: {
                            family: 'Inter',
                            size: 12,
                            weight: '600'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Gráfica de ingresos
function createRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    // Configurar tamaño del canvas
    ctx.style.maxHeight = '380px';
    ctx.style.width = '100%';

    const years = ['Año 1', 'Año 2', 'Año 3', 'Año 4', 'Año 5'];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: '50 Franquicias',
                    data: [18000, 12000, 12000, 12000, 12000],
                    borderColor: '#1e40af',
                    backgroundColor: 'rgba(30, 64, 175, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#1e40af',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 6
                },
                {
                    label: '100 Franquicias',
                    data: [48000, 36000, 36000, 36000, 36000],
                    borderColor: '#059669',
                    backgroundColor: 'rgba(5, 150, 105, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#059669',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 6
                },
                {
                    label: '150 Franquicias',
                    data: [90000, 72000, 72000, 72000, 72000],
                    borderColor: '#7c3aed',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#7c3aed',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 6
                },
                {
                    label: '200 Franquicias',
                    data: [144000, 120000, 120000, 120000, 120000],
                    borderColor: '#ea580c',
                    backgroundColor: 'rgba(234, 88, 12, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#ea580c',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 2.5,
            layout: {
                padding: {
                    top: 20,
                    bottom: 10
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            family: 'Inter',
                            size: 12,
                            weight: '600'
                        },
                        color: '#374151'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#374151',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toLocaleString('es-ES')}€`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '€' + (value / 1000) + 'k';
                        },
                        color: '#6b7280',
                        font: {
                            family: 'Inter',
                            size: 12,
                            weight: '600'
                        }
                    },
                    grid: {
                        color: '#f3f4f6',
                        lineWidth: 1
                    }
                },
                x: {
                    ticks: {
                        color: '#374151',
                        font: {
                            family: 'Inter',
                            size: 12,
                            weight: '600'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// CALCULADORA ROI - FUNCIONAL
function initCalculator() {
    console.log('Iniciando calculadora...');
    
    const slider = document.getElementById('franchiseSlider');
    const countDisplay = document.getElementById('franchiseCount');
    const year1Display = document.getElementById('year1Amount');
    const year2Display = document.getElementById('year2Amount');
    
    if (!slider || !countDisplay || !year1Display || !year2Display) {
        console.error('Elementos no encontrados');
        return;
    }
    
    function actualizar() {
        const franquicias = parseInt(slider.value);
        
        // Actualizar contador
        countDisplay.textContent = franquicias;
        
        // Actualizar slider color
        const porcentaje = ((franquicias - 1) / 299) * 100;
        slider.style.background = `linear-gradient(to right, #e91e63 ${porcentaje}%, #e9ecef ${porcentaje}%)`;
        
        // Calcular comisiones
        let com1, com2;
        if (franquicias <= 50) {
            com1 = 15; com2 = 10;
        } else if (franquicias <= 100) {
            com1 = 20; com2 = 15;
        } else if (franquicias <= 150) {
            com1 = 25; com2 = 20;
        } else if (franquicias <= 170) {
            com1 = 30; com2 = 25;
        } else {
            com1 = 30; com2 = 25;
        }
        
        // Calcular ingresos
        const ingresoAnual = franquicias * 200 * 12;
        const ano1 = Math.round((ingresoAnual * com1) / 100);
        const ano2 = Math.round((ingresoAnual * com2) / 100);
        
        // Actualizar display
        year1Display.textContent = `${ano1.toLocaleString('es-ES')}€`;
        year2Display.textContent = `${ano2.toLocaleString('es-ES')}€`;
        
        console.log(`Actualizado: ${franquicias} franquicias -> ${ano1}€ / ${ano2}€`);
    }
    
    slider.addEventListener('input', actualizar);
    slider.addEventListener('change', actualizar);
    
    actualizar();
    console.log('Calculadora inicializada');
}

// Función de actualización eliminada - ahora está integrada en initCalculator

// Animaciones de números
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                if (element.classList.contains('metric-large')) {
                    animateNumber(element);
                }
                
                if (element.classList.contains('metric-number') || element.classList.contains('metric-amount')) {
                    const target = parseInt(element.getAttribute('data-target'));
                    if (target) {
                        animateCounter(element, target);
                    }
                }
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px'
    });

    // Observar elementos con números
    const numberElements = document.querySelectorAll('.metric-large, .metric-number, .metric-amount');
    numberElements.forEach(element => {
        observer.observe(element);
    });
}

// Animar números grandes
function animateNumber(element) {
    if (element.classList.contains('animated')) return;
    
    const text = element.textContent;
    const isEuro = text.includes('€');
    const isK = text.includes('k');
    const number = parseInt(text.replace(/[€k]/g, ''));
    
    let current = 0;
    const duration = 2000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeOutCubic(progress);
        
        current = Math.floor(number * easeProgress);
        
        let displayText = current.toString();
        if (isEuro) displayText = '€' + displayText;
        if (isK) displayText += 'k';
        
        element.textContent = displayText;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = text;
            element.classList.add('animated');
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Animar contadores
function animateCounter(element, target) {
    if (element.classList.contains('animated')) return;
    
    let current = 0;
    const duration = 2500;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeOutCubic(progress);
        
        current = Math.floor(target * easeProgress);
        element.textContent = current.toLocaleString('es-ES') + '€';
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString('es-ES') + '€';
            element.classList.add('animated');
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Función de easing
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Función para prevenir transformaciones no deseadas
function preventUnwantedTransforms() {
    const elements = document.querySelectorAll('.summary-card, .pricing-card, .metric-card, .metric-card-compact, .advantage-card, .result-card');
    
    elements.forEach(element => {
        // Limpiar cualquier transformación existente
        element.style.transform = 'none';
        
        // Prevenir transformaciones futuras en eventos
        element.addEventListener('scroll', function(e) {
            this.style.transform = 'none';
        });
        
        element.addEventListener('mousemove', function(e) {
            this.style.transform = 'none';
        });
    });
}

// Efectos de scroll eliminados para evitar movimiento de elementos

// Efectos adicionales para las tarjetas - Solo fade in sin transformaciones
document.addEventListener('DOMContentLoaded', function() {
    // Efecto de aparición suave sin movimiento
    const cards = document.querySelectorAll('.summary-card, .pricing-card, .advantage-card, .metric-card-compact');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'none'; // Asegurar que no hay transformaciones
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease-out';
            card.style.opacity = '1';
        }, index * 100);
    });
});

// Utilidades de formato
const Utils = {
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },
    
    formatNumber: function(number) {
        return new Intl.NumberFormat('es-ES').format(number);
    }
}; 