// Dynamic Background with Interactive Network Animation
class DynamicBackground {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.mouseRadius = 150;
        this.animationId = null;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        this.resize();
        this.createNodes();
        this.createConnections();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createNodes() {
        const nodeCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        this.nodes = [];

        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                originalX: 0,
                originalY: 0,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 1,
                color: this.getNodeColor(),
                glowIntensity: Math.random() * 0.5 + 0.5,
                pulseSpeed: Math.random() * 0.02 + 0.01
            });
        }

        // Set original positions after creation
        this.nodes.forEach(node => {
            node.originalX = node.x;
            node.originalY = node.y;
        });
    }

    getNodeColor() {
        const colors = [
            '#9333ea', // Purple
            '#3b82f6', // Blue
            '#ec4899', // Pink
            '#06b6d4', // Cyan
            '#8b5cf6'  // Violet
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    createConnections() {
        this.connections = [];
        const maxDistance = 120;

        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const distance = this.getDistance(this.nodes[i], this.nodes[j]);
                
                if (distance < maxDistance) {
                    this.connections.push({
                        nodeA: i,
                        nodeB: j,
                        distance: distance,
                        maxDistance: maxDistance,
                        opacity: Math.max(0, 1 - (distance / maxDistance))
                    });
                }
            }
        }
    }

    getDistance(nodeA, nodeB) {
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    updateNodes() {
        this.nodes.forEach((node, index) => {
            // Mouse interaction
            const mouseDistance = this.getDistance(node, this.mouse);
            
            if (mouseDistance < this.mouseRadius) {
                const force = (this.mouseRadius - mouseDistance) / this.mouseRadius;
                const angle = Math.atan2(node.y - this.mouse.y, node.x - this.mouse.x);
                
                node.x += Math.cos(angle) * force * 3;
                node.y += Math.sin(angle) * force * 3;
            } else {
                // Return to original position
                node.x += (node.originalX - node.x) * 0.05;
                node.y += (node.originalY - node.y) * 0.05;
            }

            // Add slight floating motion
            node.x += Math.sin(Date.now() * node.pulseSpeed + index) * 0.5;
            node.y += Math.cos(Date.now() * node.pulseSpeed + index) * 0.3;

            // Update glow intensity
            node.glowIntensity = 0.5 + Math.sin(Date.now() * node.pulseSpeed) * 0.5;

            // Keep nodes within bounds
            if (node.x < 0) node.x = this.canvas.width;
            if (node.x > this.canvas.width) node.x = 0;
            if (node.y < 0) node.y = this.canvas.height;
            if (node.y > this.canvas.height) node.y = 0;
        });
    }

    updateConnections() {
        this.connections.forEach(connection => {
            const nodeA = this.nodes[connection.nodeA];
            const nodeB = this.nodes[connection.nodeB];
            const distance = this.getDistance(nodeA, nodeB);
            
            connection.distance = distance;
            connection.opacity = Math.max(0, 1 - (distance / connection.maxDistance));
        });
    }

    drawNode(node) {
        const gradient = this.ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, node.radius * 3
        );
        
        gradient.addColorStop(0, node.color + Math.round(node.glowIntensity * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.5, node.color + '40');
        gradient.addColorStop(1, node.color + '00');

        // Draw glow
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Draw core
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = node.color;
        this.ctx.fill();
    }

    drawConnection(connection) {
        const nodeA = this.nodes[connection.nodeA];
        const nodeB = this.nodes[connection.nodeB];
        
        if (connection.opacity <= 0) return;

        // Create gradient for the line
        const gradient = this.ctx.createLinearGradient(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
        gradient.addColorStop(0, nodeA.color + Math.round(connection.opacity * 100).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.5, '#ffffff' + Math.round(connection.opacity * 50).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, nodeB.color + Math.round(connection.opacity * 100).toString(16).padStart(2, '0'));

        this.ctx.beginPath();
        this.ctx.moveTo(nodeA.x, nodeA.y);
        this.ctx.lineTo(nodeB.x, nodeB.y);
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = connection.opacity * 2;
        this.ctx.stroke();
    }

    draw() {
        // Clear canvas with fade effect
        this.ctx.fillStyle = 'rgba(12, 12, 30, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections first
        this.connections.forEach(connection => this.drawConnection(connection));

        // Draw nodes on top
        this.nodes.forEach(node => this.drawNode(node));
    }

    animate() {
        this.updateNodes();
        this.updateConnections();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        // Mouse move
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.resize();
            this.createNodes();
            this.createConnections();
        });

        // Touch events for mobile
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.mouse.x = touch.clientX;
            this.mouse.y = touch.clientY;
        });

        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            this.mouse.x = touch.clientX;
            this.mouse.y = touch.clientY;
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DynamicBackground();
});

