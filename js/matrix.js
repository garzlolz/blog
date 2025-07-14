// Matrix Rain Effect
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-rain');
        this.ctx = this.canvas.getContext('2d');
        this.matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        this.matrix = this.matrix.split("");
        this.font_size = 10;
        this.columns = 0;
        this.drops = [];
        
        this.init();
        this.setupResizeListener();
    }

    init() {
        this.resizeCanvas();
        this.initDrops();
        this.draw();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.font_size);
        this.initDrops();
    }

    initDrops() {
        this.drops = [];
        for (let x = 0; x < this.columns; x++) {
            this.drops[x] = Math.random() * this.canvas.height;
        }
    }

    draw() {
        // Black BG for the canvas with transparency
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#00FF41'; // Green text
        this.ctx.font = this.font_size + 'px arial';

        // Looping over drops
        for (let i = 0; i < this.drops.length; i++) {
            // A random character to print
            const text = this.matrix[Math.floor(Math.random() * this.matrix.length)];
            
            // X coordinate will be i * font_size
            // Y coordinate will be value of drops[i] * font_size
            this.ctx.fillStyle = this.getRandomGreenShade();
            this.ctx.fillText(text, i * this.font_size, this.drops[i] * this.font_size);

            // Sending the drop back to the top randomly after it has crossed the screen
            // Adding randomness to the reset to make the drops scattered on the Y axis
            if (this.drops[i] * this.font_size > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }

            // Incrementing Y coordinate
            this.drops[i]++;
        }

        requestAnimationFrame(() => this.draw());
    }

    getRandomGreenShade() {
        const shades = [
            '#00FF41',
            '#00E63A',
            '#00CC33',
            '#00B32C',
            '#009925',
            '#00801E',
            '#006617'
        ];
        return shades[Math.floor(Math.random() * shades.length)];
    }

    setupResizeListener() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resizeCanvas();
            }, 250);
        });
    }
}

// Glitch Effect for Text
class GlitchEffect {
    constructor(element) {
        this.element = element;
        this.text = element.textContent;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.init();
    }

    init() {
        this.element.addEventListener('mouseenter', () => this.scramble());
    }

    scramble() {
        let iteration = 0;
        const interval = setInterval(() => {
            this.element.textContent = this.text
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return this.text[index];
                    }
                    return this.chars[Math.floor(Math.random() * this.chars.length)];
                })
                .join("");

            if (iteration >= this.text.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3;
        }, 30);
    }
}

// Cyberpunk Particle System
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        
        this.init();
    }

    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
        this.animate();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });

        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = Math.random() * 100;
        this.maxLife = this.life;
        this.color = this.getRandomCyberColor();
    }

    getRandomCyberColor() {
        const colors = ['#00FF41', '#FF0080', '#00D4FF', '#FF4500'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        if (this.life <= 0) {
            this.x = Math.random() * this.canvas.width;
            this.y = Math.random() * this.canvas.height;
            this.life = this.maxLife;
        }

        // Bounce off edges
        if (this.x <= 0 || this.x >= this.canvas.width) this.vx *= -1;
        if (this.y <= 0 || this.y >= this.canvas.height) this.vy *= -1;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha * 0.8;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Circuit Board Pattern Generator
class CircuitPattern {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.init();
    }

    init() {
        this.draw();
    }

    draw() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const gridSize = 20;

        this.ctx.strokeStyle = '#00FF41';
        this.ctx.lineWidth = 0.5;
        this.ctx.globalAlpha = 0.3;

        // Draw grid
        for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
                if (Math.random() > 0.7) {
                    this.drawCircuitElement(x, y, gridSize);
                }
            }
        }
    }

    drawCircuitElement(x, y, size) {
        this.ctx.beginPath();
        
        const type = Math.random();
        
        if (type < 0.3) {
            // Horizontal line
            this.ctx.moveTo(x, y + size/2);
            this.ctx.lineTo(x + size, y + size/2);
        } else if (type < 0.6) {
            // Vertical line
            this.ctx.moveTo(x + size/2, y);
            this.ctx.lineTo(x + size/2, y + size);
        } else {
            // Corner
            this.ctx.moveTo(x, y + size/2);
            this.ctx.lineTo(x + size/2, y + size/2);
            this.ctx.lineTo(x + size/2, y + size);
        }
        
        this.ctx.stroke();
        
        // Add nodes
        if (Math.random() > 0.8) {
            this.ctx.beginPath();
            this.ctx.arc(x + size/2, y + size/2, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = '#00D4FF';
            this.ctx.fill();
        }
    }
}

// Audio Visualizer (optional, for cyberpunk effect)
class AudioVisualizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.isInitialized = false;
    }

    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.isInitialized = true;
        } catch (error) {
            console.log('Audio not available:', error);
        }
    }

    draw() {
        if (!this.isInitialized) return;

        this.analyser.getByteFrequencyData(this.dataArray);
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const barWidth = this.canvas.width / this.dataArray.length;
        let x = 0;
        
        for (let i = 0; i < this.dataArray.length; i++) {
            const barHeight = (this.dataArray[i] / 255) * this.canvas.height;
            
            const gradient = this.ctx.createLinearGradient(0, this.canvas.height - barHeight, 0, this.canvas.height);
            gradient.addColorStop(0, '#00FF41');
            gradient.addColorStop(1, '#00D4FF');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
            
            x += barWidth;
        }
        
        requestAnimationFrame(() => this.draw());
    }
}

// Initialize Matrix Rain when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Matrix rain effect
    if (document.getElementById('matrix-rain')) {
        new MatrixRain();
    }

    // Glitch effect for titles
    document.querySelectorAll('.glitch-text').forEach(element => {
        new GlitchEffect(element);
    });

    // Add cyberpunk loading effect
    const body = document.body;
    body.classList.add('loading');
    
    setTimeout(() => {
        body.classList.remove('loading');
        body.classList.add('loaded');
    }, 1000);
});

// Mouse cursor trail effect
class CursorTrail {
    constructor() {
        this.trail = [];
        this.maxTrailLength = 20;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.addTrailPoint(e.clientX, e.clientY);
        });
        
        this.animate();
    }

    addTrailPoint(x, y) {
        this.trail.push({ x, y, life: this.maxTrailLength });
        
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }

    animate() {
        // Update trail
        this.trail.forEach((point, index) => {
            point.life--;
            if (point.life <= 0) {
                this.trail.splice(index, 1);
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize cursor trail
new CursorTrail();
