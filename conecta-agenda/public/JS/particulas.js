class Partícula {
    constructor(x, y) {
        this.posición = { x, y };
        this.velocidad = {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
        };
    }
}

class FondoPartículas {
    constructor() {
        this.lienzo = document.getElementById('particulas');
        this.ctx = this.lienzo.getContext('2d');
        this.partículas = [];
        this.densidadPartículas = 0.0001; // Densidad de partículas (partículas por píxel)
        this.distanciaMáxima = 100;
        this.tamañoPartícula = 2;

        this.redimensionar();
        this.inicializar();
        this.animar();

        // Debounce para el evento de redimensionamiento
        this.debounceRedimensionar = this.debounce(() => this.redimensionar(), 100);
        window.addEventListener('resize', () => this.debounceRedimensionar());
    }

    // Función debounce
    debounce(func, esperar) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), esperar);
        };
    }

    redimensionar() {
        this.lienzo.width = window.innerWidth;
        this.lienzo.height = window.innerHeight;
        this.inicializar(); // Reiniciar las partículas al cambiar el tamaño
    }

    inicializar() {
        // Calcular el número de partículas en función del área del lienzo
        const área = this.lienzo.width * this.lienzo.height;
        this.numPartículas = Math.floor(área * this.densidadPartículas);

        // Reiniciar el array de partículas
        this.partículas = [];
        for (let i = 0; i < this.numPartículas; i++) {
            this.partículas.push(new Partícula(
                Math.random() * this.lienzo.width,
                Math.random() * this.lienzo.height
            ));
        }
    }

    // Función para obtener el color contrario al fondo
    obtenerColorContraste() {
        const colorFondo = getComputedStyle(document.body).backgroundColor;
        const rgb = colorFondo.match(/\d+/g); // Extraer valores RGB
        if (!rgb) return '#000000'; // Si no se puede obtener el color, usar negro por defecto

        const luminosidad = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
        return luminosidad > 128 ? '#000000' : '#FFFFFF'; // Si el fondo es claro, usar negro; si es oscuro, usar blanco
    }

    actualizarPartículas() {
        this.partículas.forEach(partícula => {
            partícula.posición.x += partícula.velocidad.x;
            partícula.posición.y += partícula.velocidad.y;

            // Rebotar en los bordes
            if (partícula.posición.x <= 0 || partícula.posición.x >= this.lienzo.width) {
                partícula.velocidad.x *= -1;
            }
            if (partícula.posición.y <= 0 || partícula.posición.y >= this.lienzo.height) {
                partícula.velocidad.y *= -1;
            }
        });
    }

    dibujar() {
        this.ctx.clearRect(0, 0, this.lienzo.width, this.lienzo.height);

        // Obtener el color contrario al fondo
        const colorContraste = this.obtenerColorContraste();

        // Configurar estilos
        this.ctx.fillStyle = colorContraste;
        this.ctx.strokeStyle = colorContraste;

        // Dibujar partículas y conexiones
        this.partículas.forEach((partícula, i) => {
            // Dibujar partícula
            this.ctx.beginPath();
            this.ctx.arc(
                partícula.posición.x,
                partícula.posición.y,
                this.tamañoPartícula,
                0,
                Math.PI * 2
            );
            this.ctx.fill();

            // Dibujar conexiones
            for (let j = i + 1; j < this.partículas.length; j++) {
                const otraPartícula = this.partículas[j];
                const distancia = Math.hypot(
                    partícula.posición.x - otraPartícula.posición.x,
                    partícula.posición.y - otraPartícula.posición.y
                );

                if (distancia < this.distanciaMáxima) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(partícula.posición.x, partícula.posición.y);
                    this.ctx.lineTo(otraPartícula.posición.x, otraPartícula.posición.y);
                    this.ctx.stroke();
                }
            }
        });
    }

    animar() {
        this.actualizarPartículas();
        this.dibujar();
        requestAnimationFrame(() => this.animar());
    }
}

// Iniciar efecto
new FondoPartículas();
